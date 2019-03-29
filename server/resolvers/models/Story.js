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
					storyCategories: {
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
		!args.storyCategories
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
			}
		}
	},info)
	return story
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
	storyToApp
}