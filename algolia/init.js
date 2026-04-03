const { appsIndex, storiesIndex } = require("./indexes");
const prismaDb = require("../prismaDb");
const {
	appAlgoliaInclude,
	serializeAppForAlgolia,
	serializeStoryForAlgolia,
	storyAlgoliaInclude
} = require("../prismaHelpers");

const init = async () => {
	const infos = [
		{
			index: appsIndex,
			delegate: "app",
			include: appAlgoliaInclude,
			serialize: serializeAppForAlgolia
		},
		{
			index: storiesIndex,
			delegate: "story",
			include: storyAlgoliaInclude,
			serialize: serializeStoryForAlgolia
		}
	];

	for (const info of infos) {
		const objectsBrowser = info.index.browseAll();
		objectsBrowser.on("result", async data => {
			const all_records = await prismaDb[info.delegate].findMany({
				include: info.include
			});
			const all_objects = all_records.map(info.serialize);
			const objectsOnIndex = data.hits.map(hit => hit.objectID);
			const new_objects = [];

			all_objects.forEach(obj => {
				if (objectsOnIndex.indexOf(obj.id) === -1) {
					obj.objectID = obj.id;
					new_objects.push(obj);
				}
			});

			const deleteObjects = [];
			const all_objects_ids = all_objects.map(obj => obj.id);
			objectsOnIndex.forEach(objectID => {
				if (all_objects_ids.indexOf(objectID) === -1) {
					deleteObjects.push(objectID);
				}
			});
			info.index.addObjects(new_objects);
			info.index.deleteObjects(deleteObjects);
		});
	}
};

module.exports = init;
