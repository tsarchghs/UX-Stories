require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const exportRoot = path.join(__dirname, "..", ".export");

const readExportFile = (section) =>
  JSON.parse(fs.readFileSync(path.join(exportRoot, section, "000001.json"), "utf8")).values;

const nodes = readExportFile("nodes");
const relations = readExportFile("relations");
const nodeById = new Map(nodes.map(node => [node.id, node]));

// Some Prisma 1 relation rows in the export are corrupted for App/Story links.
// We recover the stable relations from valid rows, then rebuild the broken ones
// from adjacent image files and version-set heuristics.
const inferredAppCategoryNames = {
  "The athletic": "Sportrs",
  "Bright Mind": "Educational",
  HQ: "Entertainment",
  ClassPass: "Sportrs",
  Zero: "Test",
  SIX: "Entertainment",
  "Robin hood": "Test",
  Mucho1: "social networking",
};

const oneRelationDefs = {
  User: {
    profile_photo: { field: "profile_photoId", targetType: "File" },
    job: { field: "jobId", targetType: "Job" },
  },
  Video: {
    file: { field: "fileId", targetType: "File" },
  },
  App: {
    createdBy: { field: "createdById", targetType: "User" },
    appCategory: { field: "appCategoryId", targetType: "AppCategory" },
    logo: { field: "logoId", targetType: "File" },
  },
  Story: {
    createdBy: { field: "createdById", targetType: "User" },
    app: { field: "appId", targetType: "App" },
    video: { field: "videoId", targetType: "Video" },
    thumbnail: { field: "thumbnailId", targetType: "File" },
  },
  Library: {
    createdBy: { field: "createdById", targetType: "User" },
  },
  PageView: {
    user: { field: "userId", targetType: "User" },
  },
};

const manyRelationDefs = {
  App: {
    appVersions: { field: "appVersions", targetType: "AppVersion" },
  },
  Story: {
    appVersions: { field: "appVersions", targetType: "AppVersion" },
    storyCategories: { field: "storyCategories", targetType: "StoryCategory" },
    storyElements: { field: "storyElements", targetType: "StoryElement" },
    libraries: { field: "libraries", targetType: "Library" },
  },
};

const delegateMap = {
  File: "file",
  Job: "job",
  AppCategory: "appCategory",
  StoryCategory: "storyCategory",
  StoryElement: "storyElement",
  AppVersion: "appVersion",
  User: "user",
  Video: "video",
  App: "app",
  Library: "library",
  Story: "story",
  PageView: "pageView",
};

const createOrder = [
  "File",
  "Job",
  "AppCategory",
  "StoryCategory",
  "StoryElement",
  "AppVersion",
  "User",
  "Video",
  "App",
  "Library",
  "Story",
  "PageView",
];

const clearOrder = [
  "PageView",
  "Story",
  "Library",
  "App",
  "Video",
  "User",
  "AppVersion",
  "StoryElement",
  "StoryCategory",
  "AppCategory",
  "Job",
  "File",
];

const nodeGroups = nodes.reduce((acc, node) => {
  if (!acc[node._typeName]) {
    acc[node._typeName] = [];
  }
  acc[node._typeName].push(node);
  return acc;
}, {});

const toDate = (value) => (value ? new Date(value) : undefined);
const serializeVersionKey = (values) => values.slice().sort().join(",");
const imageFiles = (nodeGroups.File || [])
  .filter(file => /^image\//.test(file.mimetype || ""))
  .map(file => ({
    id: file.id,
    createdAtMs: new Date(file.createdAt).getTime(),
  }));

const ensureState = (state, typeName, nodeId) => {
  if (!state[typeName]) {
    state[typeName] = {};
  }
  if (!state[typeName][nodeId]) {
    state[typeName][nodeId] = {};
  }
  return state[typeName][nodeId];
};

const setOneRelation = (state, typeName, nodeId, fieldName, targetId) => {
  ensureState(state, typeName, nodeId)[fieldName] = targetId;
};

const buildValidRelationState = () => {
  const one = {};
  const many = {};

  for (const relation of relations) {
    for (let index = 0; index < relation.length; index += 1) {
      const node = relation[index];
      const other = relation[index === 0 ? 1 : 0];

      if (!node.fieldName) {
        continue;
      }

      const sourceNode = nodeById.get(node.id);
      if (!sourceNode || sourceNode._typeName !== node._typeName) {
        continue;
      }

      const oneField = oneRelationDefs[node._typeName] && oneRelationDefs[node._typeName][node.fieldName];
      if (oneField) {
        const targetNode = nodeById.get(other.id);
        if (targetNode && targetNode._typeName === oneField.targetType) {
          setOneRelation(one, node._typeName, node.id, oneField.field, other.id);
        }
      }

      const manyField = manyRelationDefs[node._typeName] && manyRelationDefs[node._typeName][node.fieldName];
      if (manyField) {
        const targetNode = nodeById.get(other.id);
        if (!targetNode || targetNode._typeName !== manyField.targetType) {
          continue;
        }
        const key = `${node._typeName}.${manyField.field}`;
        if (!many[key]) {
          many[key] = {};
        }
        if (!many[key][node.id]) {
          many[key][node.id] = new Set();
        }
        many[key][node.id].add(other.id);
      }
    }
  }

  return { one, many };
};

const findNearestImageId = (createdAt) => {
  const createdAtMs = new Date(createdAt).getTime();
  return imageFiles.reduce((best, file) => {
    const diff = Math.abs(file.createdAtMs - createdAtMs);
    if (!best || diff < best.diff) {
      return { id: file.id, diff };
    }
    return best;
  }, null);
};

const buildVersionNameLookup = () => Object.fromEntries(
  (nodeGroups.AppVersion || []).map(appVersion => [appVersion.id, appVersion.name])
);

const buildStoryAppAssignments = (manyRelations) => {
  const versionNamesById = buildVersionNameLookup();
  const apps = (nodeGroups.App || []).map(app => ({
    id: app.id,
    name: app.name,
    createdAt: app.createdAt,
    createdAtMs: new Date(app.createdAt).getTime(),
    versionNames: Array.from((manyRelations["App.appVersions"] && manyRelations["App.appVersions"][app.id]) || [])
      .map(id => versionNamesById[id])
      .filter(Boolean)
      .sort(),
  })).sort((left, right) => left.createdAtMs - right.createdAtMs);

  const appsByVersionKey = apps.reduce((acc, app) => {
    const key = serializeVersionKey(app.versionNames);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(app);
    return acc;
  }, {});

  const stories = (nodeGroups.Story || []).map(story => ({
    id: story.id,
    createdAtMs: new Date(story.createdAt).getTime(),
    versionNames: Array.from((manyRelations["Story.appVersions"] && manyRelations["Story.appVersions"][story.id]) || [])
      .map(id => versionNamesById[id])
      .filter(Boolean)
      .sort(),
  })).sort((left, right) => left.createdAtMs - right.createdAtMs);

  const storiesByVersionKey = stories.reduce((acc, story) => {
    const key = serializeVersionKey(story.versionNames);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(story);
    return acc;
  }, {});

  const assignments = {};

  for (const [versionKey, storyGroup] of Object.entries(storiesByVersionKey)) {
    if (!versionKey) {
      continue;
    }

    let candidates = appsByVersionKey[versionKey];
    if (!candidates || !candidates.length) {
      const versionNames = versionKey.split(",");
      candidates = apps
        .filter(app => versionNames.every(versionName => app.versionNames.includes(versionName)))
        .sort((left, right) => (
          left.versionNames.length - right.versionNames.length ||
          left.createdAtMs - right.createdAtMs
        ));
    }

    if (!candidates.length) {
      continue;
    }

    storyGroup.forEach((story, index) => {
      assignments[story.id] = candidates[index % candidates.length].id;
    });
  }

  stories.forEach((story, index) => {
    if (assignments[story.id]) {
      return;
    }

    let inheritedAppId;
    for (let left = index - 1; left >= 0; left -= 1) {
      inheritedAppId = assignments[stories[left].id];
      if (inheritedAppId) {
        break;
      }
    }

    if (!inheritedAppId) {
      for (let right = index + 1; right < stories.length; right += 1) {
        inheritedAppId = assignments[stories[right].id];
        if (inheritedAppId) {
          break;
        }
      }
    }

    assignments[story.id] = inheritedAppId || (apps[0] && apps[0].id);
  });

  return assignments;
};

const { one: oneRelations, many: manyRelations } = buildValidRelationState();
const appCategoryIdsByName = Object.fromEntries(
  (nodeGroups.AppCategory || []).map(appCategory => [appCategory.name, appCategory.id])
);
const storyAppAssignments = buildStoryAppAssignments(manyRelations);

(nodeGroups.App || []).forEach(app => {
  const nearestImage = findNearestImageId(app.createdAt);
  if (nearestImage) {
    setOneRelation(oneRelations, "App", app.id, "logoId", nearestImage.id);
  }
  const inferredCategoryName = inferredAppCategoryNames[app.name] || "Test";
  const appCategoryId = appCategoryIdsByName[inferredCategoryName];
  if (appCategoryId) {
    setOneRelation(oneRelations, "App", app.id, "appCategoryId", appCategoryId);
  }
});

(nodeGroups.Story || []).forEach(story => {
  const nearestImage = findNearestImageId(story.createdAt);
  if (nearestImage) {
    setOneRelation(oneRelations, "Story", story.id, "thumbnailId", nearestImage.id);
  }
  const appId = storyAppAssignments[story.id];
  if (appId) {
    setOneRelation(oneRelations, "Story", story.id, "appId", appId);
    const appRelations = oneRelations.App && oneRelations.App[appId];
    if (appRelations && appRelations.createdById) {
      setOneRelation(oneRelations, "Story", story.id, "createdById", appRelations.createdById);
    }
  }
});

const withOneRelations = (typeName, node, data) => ({
  ...data,
  ...((oneRelations[typeName] && oneRelations[typeName][node.id]) || {}),
});

const recordFactories = {
  File: (node) =>
    withOneRelations("File", node, {
      id: node.id,
      filename: node.filename,
      mimetype: node.mimetype,
      encoding: node.encoding || "",
      url: node.url,
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
  Video: (node) =>
    withOneRelations("Video", node, {
      id: node.id,
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
  Job: (node) => ({
    id: node.id,
    name: node.name,
    createdAt: toDate(node.createdAt),
    updatedAt: toDate(node.updatedAt),
  }),
  PageView: (node) =>
    withOneRelations("PageView", node, {
      id: node.id,
      pathname: node.pathname,
      agent: node.agent,
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
  User: (node) =>
    withOneRelations("User", node, {
      id: node.id,
      email: node.email,
      password: node.password,
      full_name: node.full_name,
      role: node.role,
      customer_id: node.customer_id || null,
      subscription_id: node.subscription_id || null,
      google_accessToken: node.google_accessToken || null,
      facebook_accessToken: node.facebook_accessToken || null,
      oauth_id: node.oauth_id || null,
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
  AppVersion: (node) => ({
    id: node.id,
    name: node.name,
    createdAt: toDate(node.createdAt),
    updatedAt: toDate(node.updatedAt),
  }),
  AppCategory: (node) => ({
    id: node.id,
    name: node.name,
    createdAt: toDate(node.createdAt),
    updatedAt: toDate(node.updatedAt),
  }),
  StoryCategory: (node) => ({
    id: node.id,
    name: node.name,
    createdAt: toDate(node.createdAt),
    updatedAt: toDate(node.updatedAt),
  }),
  StoryElement: (node) => ({
    id: node.id,
    name: node.name,
    createdAt: toDate(node.createdAt),
    updatedAt: toDate(node.updatedAt),
  }),
  App: (node) =>
    withOneRelations("App", node, {
      id: node.id,
      name: node.name,
      description: node.description || null,
      company: node.company,
      platform: node.platform,
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
  Story: (node) =>
    withOneRelations("Story", node, {
      id: node.id,
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
  Library: (node) =>
    withOneRelations("Library", node, {
      id: node.id,
      name: node.name,
      custom_updatedAt: toDate(node.custom_updatedAt),
      createdAt: toDate(node.createdAt),
      updatedAt: toDate(node.updatedAt),
    }),
};

const validateRequiredRelations = () => {
  const required = {
    Video: ["fileId"],
    App: ["createdById", "appCategoryId", "logoId"],
    Story: ["createdById", "appId", "videoId", "thumbnailId"],
    Library: ["createdById"],
  };

  for (const [typeName, fields] of Object.entries(required)) {
    for (const node of nodeGroups[typeName] || []) {
      const record = recordFactories[typeName](node);
      for (const field of fields) {
        if (!record[field]) {
          throw new Error(`Missing required relation ${typeName}.${field} for node ${node.id}`);
        }
      }
    }
  }
};

const clearDatabase = async () => {
  for (const typeName of clearOrder) {
    await prisma[delegateMap[typeName]].deleteMany();
  }
};

const insertBaseRecords = async () => {
  for (const typeName of createOrder) {
    const records = (nodeGroups[typeName] || []).map(recordFactories[typeName]);
    if (!records.length) {
      continue;
    }
    await prisma[delegateMap[typeName]].createMany({ data: records });
    console.log(`Inserted ${records.length} ${typeName} records`);
  }
};

const connectManyRelations = async () => {
  const relationTasks = [
    ["App.appVersions", "app", "appVersions"],
    ["Story.appVersions", "story", "appVersions"],
    ["Story.storyCategories", "story", "storyCategories"],
    ["Story.storyElements", "story", "storyElements"],
    ["Story.libraries", "story", "libraries"],
  ];

  for (const [key, delegate, field] of relationTasks) {
    const assignments = manyRelations[key] || {};
    for (const [id, values] of Object.entries(assignments)) {
      await prisma[delegate].update({
        where: { id },
        data: {
          [field]: {
            connect: Array.from(values).map((relatedId) => ({ id: relatedId })),
          },
        },
      });
    }
    if (Object.keys(assignments).length) {
      console.log(`Connected ${key} for ${Object.keys(assignments).length} records`);
    }
  }
};

const verifyCounts = async () => {
  for (const typeName of createOrder) {
    const expected = (nodeGroups[typeName] || []).length;
    const actual = await prisma[delegateMap[typeName]].count();
    if (expected !== actual) {
      throw new Error(`Count mismatch for ${typeName}: expected ${expected}, got ${actual}`);
    }
  }
};

const main = async () => {
  validateRequiredRelations();
  await clearDatabase();
  await insertBaseRecords();
  await connectManyRelations();
  await verifyCounts();
  console.log("Prisma 1 export import complete");
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
