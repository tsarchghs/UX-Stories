const legacyOrderBy = (value) => {
  if (!value) {
    return undefined;
  }

  const lastUnderscore = value.lastIndexOf("_");
  if (lastUnderscore === -1) {
    return undefined;
  }

  const field = value.slice(0, lastUnderscore);
  const direction = value.slice(lastUnderscore + 1).toLowerCase();
  return { [field]: direction };
};

const serializeNamedNode = (node) => (node ? { id: node.id, name: node.name } : null);
const serializeFileNode = (node) => (node ? { id: node.id, url: node.url } : null);
const serializeCreatedByNode = (node) => (node ? { id: node.id, full_name: node.full_name } : null);

const adminConfig = {
  user: {
    delegate: "user",
    include: {
      libraries: { select: { id: true, name: true } },
      job: { select: { id: true, name: true } },
      profile_photo: { select: { id: true, url: true } },
    },
    serialize(node) {
      return {
        id: node.id,
        full_name: node.full_name,
        email: node.email,
        password: node.password,
        libraries: (node.libraries || []).map(serializeNamedNode),
        job: serializeNamedNode(node.job),
        profile_photo: serializeFileNode(node.profile_photo),
        role: node.role,
      };
    },
  },
  app: {
    delegate: "app",
    include: {
      logo: { select: { id: true, url: true } },
      appCategory: { select: { id: true, name: true } },
      appVersions: { select: { id: true, name: true } },
      createdBy: { select: { id: true, full_name: true } },
    },
    serialize(node) {
      return {
        id: node.id,
        logo: serializeFileNode(node.logo),
        name: node.name,
        description: node.description,
        platform: node.platform,
        company: node.company,
        appVersions: (node.appVersions || []).map(serializeNamedNode),
        appCategory: serializeNamedNode(node.appCategory),
        createdBy: serializeCreatedByNode(node.createdBy),
      };
    },
  },
  story: {
    delegate: "story",
    include: {
      app: { select: { id: true, name: true } },
      appVersions: { select: { id: true, name: true } },
      storyCategories: { select: { id: true, name: true } },
      storyElements: { select: { id: true, name: true } },
      video: { select: { id: true, file: { select: { id: true, url: true } } } },
      thumbnail: { select: { id: true, url: true } },
      createdBy: { select: { id: true, full_name: true } },
    },
    serialize(node) {
      return {
        id: node.id,
        app: serializeNamedNode(node.app),
        appVersions: (node.appVersions || []).map(serializeNamedNode),
        storyCategories: (node.storyCategories || []).map(serializeNamedNode),
        storyElements: (node.storyElements || []).map(serializeNamedNode),
        video: node.video
          ? {
              id: node.video.id,
              file: serializeFileNode(node.video.file),
            }
          : null,
        thumbnail: serializeFileNode(node.thumbnail),
        createdBy: serializeCreatedByNode(node.createdBy),
      };
    },
  },
  appCategory: {
    delegate: "appCategory",
    include: undefined,
    serialize: serializeNamedNode,
  },
  storyCategory: {
    delegate: "storyCategory",
    include: undefined,
    serialize: serializeNamedNode,
  },
  storyElement: {
    delegate: "storyElement",
    include: undefined,
    serialize: serializeNamedNode,
  },
  job: {
    delegate: "job",
    include: undefined,
    serialize: serializeNamedNode,
  },
};

const connectionTypeToModel = {
  usersConnection: "user",
  appsConnection: "app",
  storiesConnection: "story",
  appCategoriesConnection: "appCategory",
  storyCategoriesConnection: "storyCategory",
  storyElementsConnection: "storyElement",
  jobsConnection: "job",
};

const queryTypeToModel = {
  user: "user",
  app: "app",
  story: "story",
  appCategory: "appCategory",
  storyCategory: "storyCategory",
  storyElement: "storyElement",
  job: "job",
};

const mutationTypeToModel = {
  createUser: "user",
  createApp: "app",
  createAppCategory: "appCategory",
  createAppVersion: "appVersion",
  createStory: "story",
  createStoryCategory: "storyCategory",
  createStoryElement: "storyElement",
  createJob: "job",
  updateUser: "user",
  updateApp: "app",
  updateAppCategory: "appCategory",
  updateAppVersion: "appVersion",
  updateStory: "story",
  updateStoryCategory: "storyCategory",
  updateStoryElement: "storyElement",
  updateJob: "job",
};

const deleteTypeToModel = {
  deleteUser: "user",
  deleteApp: "app",
  deleteStory: "story",
  deleteAppCategory: "appCategory",
  deleteStoryCategory: "storyCategory",
  deleteStoryElement: "storyElement",
  deleteJob: "job",
};

const getAdminConfig = (model) => {
  const config = adminConfig[model];
  if (!config) {
    throw new Error(`No admin config for model ${model}`);
  }
  return config;
};

const getAdminRecord = async (db, model, where) => {
  const config = getAdminConfig(model);
  return db[config.delegate].findUnique({
    where,
    include: config.include,
  });
};

const appAlgoliaInclude = {
  logo: { select: { id: true, url: true } },
  appCategory: { select: { id: true, name: true } },
  appVersions: { select: { id: true, name: true } },
  stories: {
    select: {
      id: true,
      thumbnail: { select: { id: true, url: true } },
    },
  },
};

const storyAlgoliaInclude = {
  app: {
    select: {
      id: true,
      name: true,
      description: true,
      logo: { select: { id: true, url: true } },
      appCategory: { select: { id: true, name: true } },
    },
  },
  video: {
    select: {
      id: true,
      file: { select: { id: true, url: true } },
    },
  },
  appVersions: { select: { id: true, name: true } },
  storyElements: { select: { id: true, name: true } },
  storyCategories: { select: { id: true, name: true } },
  thumbnail: { select: { id: true, url: true } },
};

const serializeAppForAlgolia = (node) => ({
  id: node.id,
  name: node.name,
  description: node.description,
  company: node.company,
  platform: node.platform,
  logo: serializeFileNode(node.logo),
  appCategory: serializeNamedNode(node.appCategory),
  appVersions: (node.appVersions || []).map(serializeNamedNode),
  stories: (node.stories || []).map((story) => ({
    id: story.id,
    thumbnail: serializeFileNode(story.thumbnail),
  })),
  createdAt: node.createdAt,
  updatedAt: node.updatedAt,
});

const serializeStoryForAlgolia = (node) => ({
  id: node.id,
  app: node.app
    ? {
        id: node.app.id,
        name: node.app.name,
        description: node.app.description,
        logo: serializeFileNode(node.app.logo),
        appCategory: serializeNamedNode(node.app.appCategory),
      }
    : null,
  video: node.video
    ? {
        id: node.video.id,
        file: serializeFileNode(node.video.file),
      }
    : null,
  appVersions: (node.appVersions || []).map(serializeNamedNode),
  storyElements: (node.storyElements || []).map(serializeNamedNode),
  storyCategories: (node.storyCategories || []).map(serializeNamedNode),
  thumbnail: serializeFileNode(node.thumbnail),
  createdAt: node.createdAt,
  updatedAt: node.updatedAt,
});

module.exports = {
  adminConfig,
  appAlgoliaInclude,
  connectionTypeToModel,
  deleteTypeToModel,
  getAdminConfig,
  getAdminRecord,
  legacyOrderBy,
  mutationTypeToModel,
  queryTypeToModel,
  serializeAppForAlgolia,
  serializeStoryForAlgolia,
  storyAlgoliaInclude,
};
