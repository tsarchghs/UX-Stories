const authResolvers = require("./authentication");
const appCategoryResolvers = require("./models/AppCategory");
const appVersionResolvers = require("./models/AppVersion");
const appResolvers = require("./models/App");
const storyCategoryResolvers = require("./models/StoryCategory");
const fileResolvers = require("./models/File");
const storyElementResolvers = require("./models/StoryElement");
const storyResolvers = require("./models/Story");

module.exports = {
	Query: {
		login: authResolvers.login
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
		linkAppVersionToStory: appVersionResolvers.linkAppVersionToStory,

		createApp: appResolvers.createApp,
		uploadFile: fileResolvers.uploadFile,

		createStoryCategory: storyCategoryResolvers.createStoryCategory,
		editStoryCategory: storyCategoryResolvers.editStoryCategory,
		deleteStoryCategory: storyCategoryResolvers.deleteStoryCategory,
		linkStoryCategoryToStory: storyCategoryResolvers.linkStoryCategoryToStory,

		createStoryElement: storyElementResolvers.createStoryElement,
		editStoryElement: storyElementResolvers.editStoryElement,
		deleteStoryElement: storyElementResolvers.deleteStoryElement,
		linkStoryElementToStory: storyElementResolvers.linkStoryElementToStory,

		createStory: storyResolvers.createStory
	}
}