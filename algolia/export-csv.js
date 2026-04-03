require("dotenv").config();

const fs = require("fs");
const path = require("path");
const prismaDb = require("../prismaDb");
const {
  appAlgoliaInclude,
  serializeAppForAlgolia,
  serializeStoryForAlgolia,
  storyAlgoliaInclude,
} = require("../prismaHelpers");

const outputDir = path.join(__dirname, "..", "algolia-export");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const toIso = (value) => {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const toJson = (value) => JSON.stringify(value ?? null);

const toPipeList = (items, field) =>
  (Array.isArray(items) ? items : [])
    .map((item) => (item && item[field] != null ? String(item[field]) : ""))
    .filter(Boolean)
    .join("|");

const escapeCsv = (value) => {
  const stringValue = value == null ? "" : String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
};

const writeCsv = (filePath, columns, rows) => {
  const lines = [
    columns.map(escapeCsv).join(","),
    ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
};

const appColumns = [
  "objectID",
  "id",
  "name",
  "description",
  "company",
  "platform",
  "logo_id",
  "logo_url",
  "appCategory_id",
  "appCategory_name",
  "appVersion_ids",
  "appVersion_names",
  "appVersions_json",
  "story_ids",
  "stories_json",
  "createdAt",
  "updatedAt",
  "algolia_record_json",
];

const storyColumns = [
  "objectID",
  "id",
  "app_id",
  "app_name",
  "app_description",
  "app_logo_id",
  "app_logo_url",
  "app_appCategory_id",
  "app_appCategory_name",
  "video_id",
  "video_file_id",
  "video_file_url",
  "appVersion_ids",
  "appVersion_names",
  "appVersions_json",
  "storyElement_ids",
  "storyElement_names",
  "storyElements_json",
  "storyCategory_ids",
  "storyCategory_names",
  "storyCategories_json",
  "thumbnail_id",
  "thumbnail_url",
  "createdAt",
  "updatedAt",
  "algolia_record_json",
];

const appRow = (record) => ({
  objectID: record.id,
  id: record.id,
  name: record.name || "",
  description: record.description || "",
  company: record.company || "",
  platform: record.platform || "",
  logo_id: record.logo?.id || "",
  logo_url: record.logo?.url || "",
  appCategory_id: record.appCategory?.id || "",
  appCategory_name: record.appCategory?.name || "",
  appVersion_ids: toPipeList(record.appVersions, "id"),
  appVersion_names: toPipeList(record.appVersions, "name"),
  appVersions_json: toJson(record.appVersions),
  story_ids: toPipeList(record.stories, "id"),
  stories_json: toJson(record.stories),
  createdAt: toIso(record.createdAt),
  updatedAt: toIso(record.updatedAt),
  algolia_record_json: toJson(record),
});

const storyRow = (record) => ({
  objectID: record.id,
  id: record.id,
  app_id: record.app?.id || "",
  app_name: record.app?.name || "",
  app_description: record.app?.description || "",
  app_logo_id: record.app?.logo?.id || "",
  app_logo_url: record.app?.logo?.url || "",
  app_appCategory_id: record.app?.appCategory?.id || "",
  app_appCategory_name: record.app?.appCategory?.name || "",
  video_id: record.video?.id || "",
  video_file_id: record.video?.file?.id || "",
  video_file_url: record.video?.file?.url || "",
  appVersion_ids: toPipeList(record.appVersions, "id"),
  appVersion_names: toPipeList(record.appVersions, "name"),
  appVersions_json: toJson(record.appVersions),
  storyElement_ids: toPipeList(record.storyElements, "id"),
  storyElement_names: toPipeList(record.storyElements, "name"),
  storyElements_json: toJson(record.storyElements),
  storyCategory_ids: toPipeList(record.storyCategories, "id"),
  storyCategory_names: toPipeList(record.storyCategories, "name"),
  storyCategories_json: toJson(record.storyCategories),
  thumbnail_id: record.thumbnail?.id || "",
  thumbnail_url: record.thumbnail?.url || "",
  createdAt: toIso(record.createdAt),
  updatedAt: toIso(record.updatedAt),
  algolia_record_json: toJson(record),
});

const main = async () => {
  ensureDir(outputDir);

  const apps = await prismaDb.app.findMany({
    include: appAlgoliaInclude,
    orderBy: { createdAt: "asc" },
  });
  const stories = await prismaDb.story.findMany({
    include: storyAlgoliaInclude,
    orderBy: { createdAt: "asc" },
  });

  const appRecords = apps.map((record) => serializeAppForAlgolia(record));
  const storyRecords = stories.map((record) => serializeStoryForAlgolia(record));

  writeCsv(
    path.join(outputDir, "apps_index.csv"),
    appColumns,
    appRecords.map(appRow)
  );
  writeCsv(
    path.join(outputDir, "stories_index.csv"),
    storyColumns,
    storyRecords.map(storyRow)
  );

  fs.writeFileSync(
    path.join(outputDir, "summary.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "current Prisma database reconstructed from the old export",
        indexes: {
          apps_index: appRecords.length,
          stories_index: storyRecords.length,
        },
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Exported ${appRecords.length} apps to ${path.join(outputDir, "apps_index.csv")}`);
  console.log(`Exported ${storyRecords.length} stories to ${path.join(outputDir, "stories_index.csv")}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaDb.$disconnect();
  });
