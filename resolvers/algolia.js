const { appsIndex, storiesIndex } = require("../algolia/indexes");
const prismaDb = require("../prismaDb");
const {
	appAlgoliaInclude,
	serializeAppForAlgolia,
	serializeStoryForAlgolia,
	storyAlgoliaInclude
} = require("../prismaHelpers");

const getInfo = args => {
	switch (args.indexName) {
		case "apps_index":
			return {
				index: appsIndex,
				delegate: "app",
				include: appAlgoliaInclude,
				serialize: serializeAppForAlgolia
			};
		case "stories_index":
			return {
				index: storiesIndex,
				delegate: "story",
				include: storyAlgoliaInclude,
				serialize: serializeStoryForAlgolia
			};
		default:
			throw new Error("Invalid index name");
	}
};

const addAlgoliaIndex = async (root, args) => {
	const info = getInfo(args);
	const record = await prismaDb[info.delegate].findUnique({
		where: { id: args.object_id },
		include: info.include
	});
	if (!record) {
		return { success: false };
	}
	const obj = info.serialize(record);
	obj.objectID = obj.id;
	try {
		await info.index.addObject(obj);
	} catch (error) {
		console.log(error);
		return { success: false };
	}
	return { success: true };
};

const updateAlgoliaIndex = async (root, args) => {
	const info = getInfo(args);
	const record = await prismaDb[info.delegate].findUnique({
		where: { id: args.object_id },
		include: info.include
	});
	if (!record) {
		return { success: false };
	}
	const obj = info.serialize(record);
	obj.objectID = obj.id;
	try {
		await info.index.partialUpdateObject(obj);
	} catch (error) {
		console.log(error);
		return { success: false };
	}
	return { success: true };
};

const deleteAlgoliaIndex = async (root, args) => {
	const info = getInfo(args);
	try {
		await info.index.deleteObject(args.object_id);
	} catch (error) {
		console.log(error);
		return { success: false };
	}
	return { success: true };
};

module.exports = {
	updateAlgoliaIndex,
	deleteAlgoliaIndex,
	addAlgoliaIndex
};
