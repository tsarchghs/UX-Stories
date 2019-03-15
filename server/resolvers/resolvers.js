const authResolvers = require("./authentication");
const appCategoryResolvers = require("./models/AppCategory");
const appVersionResolvers = require("./models/AppVersion");
const appResolvers = require("./models/App");
const storyCategoryResolvers = require("./models/StoryCategory");
const fileResolvers = require("./models/File");
const storyElementResolvers = require("./models/StoryElement");
const storyResolvers = require("./models/Story");
const libraryResolvers = require("./models/Library");

module.exports = {
	Query: {
		login: authResolvers.login,
		apps: appResolvers.apps,
		stories: storyResolvers.stories
	},
	Mutation: {
		signUp: authResolvers.signUp,

		createAppCategory: appCategoryResolvers.createAppCategory,
		editAppCategory: appCategoryResolvers.editAppCategory,
		deleteAppCategory: appCategoryResolvers.deleteAppCategory,

		createAppVersion: appVersionResolvers.createAppVersion,
		editAppVersion: appVersionResolvers.editAppVersion,
		deleteAppVersion: appVersionResolvers.deleteAppVersion,
		appVersionToApp: appVersionResolvers.appVersionToApp,
		appVersionToStory: appVersionResolvers.appVersionToStory,

		createApp: appResolvers.createApp,
		uploadFile: fileResolvers.uploadFile,

		createStoryCategory: storyCategoryResolvers.createStoryCategory,
		editStoryCategory: storyCategoryResolvers.editStoryCategory,
		deleteStoryCategory: storyCategoryResolvers.deleteStoryCategory,
		storyCategoryToStory: storyCategoryResolvers.storyCategoryToStory,

		createStoryElement: storyElementResolvers.createStoryElement,
		editStoryElement: storyElementResolvers.editStoryElement,
		deleteStoryElement: storyElementResolvers.deleteStoryElement,
		storyElementToStory: storyElementResolvers.storyElementToStory,

		createLibrary: libraryResolvers.createLibrary,
		editLibrary: libraryResolvers.editLibrary,
		deleteLibrary: libraryResolvers.deleteLibrary,

		createStory: storyResolvers.createStory,
		storyToLibrary: storyResolvers.storyToLibrary,
		storyToApp: storyResolvers.storyToApp
	},
	App: {
		async stories(parent,args,context) {
			return await context.prisma.stories({
				where: {
					app: { id: parent.id }
				}
			})
		},
		async createBy(parent,args,context) {
			const user = await context.prisma.users({
				where: {	
					apps_some: {
						id: parent.id
					}
				}
			});
			console.log(user,1);
			return user[0];
		}
	}
}