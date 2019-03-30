const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");

const stories = async (root,args,context,info) => {
	if (args.storiesFilterInput && 
		!(
			args.storiesFilterInput.app || args.storiesFilterInput.appCategory || typeof(args.storiesFilterInput.storyName_contains) === "string" ||
			(args.storiesFilterInput.storyCategories && args.storiesFilterInput.storyCategories.length) ||
			(args.storiesFilterInput.appVersions && args.storiesFilterInput.appVersions.length) ||

			(args.storiesFilterInput.storyElements && args.storiesFilterInput.storyElements.length) || args.storiesFilterInput.inLibrary
		)	
	) {
		throw new Error("If storiesFilterInput provided, appVersions,appCategory,storyCategory,inLibrary or element must be specified")
	}
	const filterBy = {where:{AND:[]}};
	if (args.storiesFilterInput){
		if (args.storiesFilterInput.app){
			filterBy["where"]["app"] = {
				id: args.storiesFilterInput.app
			}
		}
		if (args.storiesFilterInput.inLibrary){
			filterBy["where"]["libraries_some"] = {
				id: args.storiesFilterInput.inLibrary
			}
		}
		if (args.storiesFilterInput.storyName_contains){
			filterBy["where"]["AND"] = [{
				storyCategories_some:{
					name_contains: args.storiesFilterInput.storyName_contains
				}
			}]
		}
		if (args.storiesFilterInput.appCategory){
			filterBy["where"]["app"] = {
				"appCategory": {
					id: args.storiesFilterInput.appCategory
				}
			}
		}
		if (args.storiesFilterInput.storyCategories && args.storiesFilterInput.storyCategories.length){
			filterBy["where"]["AND"] = filterBy["where"]["AND"].concat(
				args.storiesFilterInput.storyCategories.map(storyCategory => ({
					storyCategories_some: {
						id: storyCategory
					}
				}))
			)
		}
		if (args.storiesFilterInput.storyElements && args.storiesFilterInput.storyElements.length){
			filterBy["where"]["AND"] = filterBy["where"]["AND"].concat(
				args.storiesFilterInput.storyElements.map(storyElement => (
					{
						"storyElements_some": {
							id: storyElement
						}
					}
				)))
		}
		if (args.storiesFilterInput.appVersions && args.storiesFilterInput.appVersions.length){
			filterBy["where"]["AND"] = filterBy["where"]["AND"].concat(
				args.storiesFilterInput.appVersions.map(appVersion => (
					{
						"appVersions_some": {
							id: appVersion
						}
					}
				)))
		}
	}
	const storiesL = context.db.query.stories(filterBy,info);
	return storiesL;
}

const createStory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (
		!args.app || 
		!args.video ||
		!args.thumbnail || 
		!args.appVersions ||
		!args.storyCategories ||
		!args.storyElements
	){
		throw new Error("Please make sure that all of your arguments are non empty!");
	}
	const createBy = context.user
	const videoFile = await fileHandling.processUpload(args.video.base64,
													args.video.mimetype,
													context);
	const thumbnail = await fileHandling.processUpload(args.thumbnail.base64,
														args.thumbnail.mimetype,
														context);

	const connectAppVersions = args.appVersions.map(x => ({id: x}));
	const connectAppCategories = args.storyCategories.map(x => ({id: x}));
	const connectStoryElements = args.storyElements.map(x => ({id: x}));
	const story = await context.db.mutation.createStory({
		data:{
			createdBy: {
				connect: {
					id: createBy.id
				}
			},
			app: {
				connect: {
					id: args.app
				}
			},
			video: {
				create:{
					file: {
						connect:{
							id: videoFile.id
						}
					}
				}
			},
			thumbnail: {
				connect: {
					id: thumbnail.id
				}
			},
			appVersions: {
				connect: [...connectAppVersions,]
			},
			storyCategories: {
				connect: [...connectAppCategories]
			},
			storyElements: {
				conenct: [...connectStoryElements]
			}
		}
	},info)
	return story
}

const editStory = async (root,args,context,info) =>{
	permissions.loginPermission(context,"ADMIN")
	if (!args.id){
		throw new Error("id argument is required");
	}
	if (args.app || (args.appVersions && args.appVersions.length) ||
		(args.storyCategories && args.storyCategories.length) ||
		(args.storyElements && args.storyElements.length) ||
		(args.video && args.video.base64 && args.video.mimetype) ||
		(args.thumbnail && args.thumbnail.base64 && args.thumbnail.mimetype) 
	){
		let data = {}
		if (args.app) {
			data["app"] = {
				connect:{id:args.app}
			}
		}
		if (args.storyElements && args.storyElements.length){
			let links = {}
			args.storyElements.map(x => {
				links[x.type] = {id:x.storyElement}
			});
			data["storyElements"] = links
		}
		if (args.appVersions && args.appVersions.length){
			let links = {}
			args.appVersion.map(x => {
				links[x.type] = {id:x.appVersion}
			});

			data["appVersions"] = links
		}
		if (args.storyCategories && args.storyCategories.length){
			let links = {}
			args.storyCategories.map(x => {
				links[x.type] = {id:x.storyCategory}
			});
			data["storyCategories"] = links
		}
		if (args.thumbnail && args.thumbnail.base64 && args.thumbnail.mimetype){
			const thumbnail = await fileHandling.processUpload(args.thumbnail.base64,
																args.thumbnail.mimetype,
																context);
			data["thumbnail"] = {connect:{id:thumbnail.id}};
		}
		if (args.video && args.video.base64 && args.video.mimetype){
			const videoFile = await fileHandling.processUpload(args.video.base64,
															args.video.mimetype,
															context);
			data["video"] = {
				create:{
					file:{
						connect:{
							id:videoFile.id}
						}
					}
				} 
		}
		const story = await context.db.mutation.updateStory({
			data,
			where:{id:args.id}
		},info)
		return story;
	} else {
		throw new Error("At least an argument other than id must be specified");
	}
}

const storyToLibrary = async (root,args,context,info) => {
	permissions.loginPermission(context,"MEMBER")
	if (!args.story || !args.library) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	await permissions.storyToLibraryPermission(context,args.library);
	const library = await context.db.mutation.updateLibrary({
		where: { id: args.library },
		data: {
			stories: {
				[args.type]: { id:args.story }
			}
		}
	},info)
	return library;
}

const storyToApp = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.story || !args.app) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const app = await context.db.mutation.updateApp({
		where: { id: args.app },
		data: {
			stories: {
				[args.type]: { id:args.story }
			}
		}
	},info)
	return app;
}

module.exports = {
	stories,
	createStory,
	storyToLibrary,
	storyToApp,
	editStory
}