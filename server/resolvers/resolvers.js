const authResolvers = require("./authentication");
const appCategoryResolvers = require("./models/AppCategory");
const appVersionResolvers = require("./models/AppVersion");
const appResolvers = require("./models/App");
const storyCategoryResolvers = require("./models/StoryCategory");
const fileResolvers = require("./models/File");
const storyElementResolvers = require("./models/StoryElement");

module.exports = {
	Query: {
		login: authResolvers.login
	},
	Mutation: {
		signUp: authResolvers.signUp,

		createAppCategory: appCategoryResolvers.createAppCategory,
		editAppCategory: appCategoryResolvers.editAppCategory,

		createAppVersion: appVersionResolvers.createAppVersion,
		editAppVersion: appVersionResolvers.editAppVersion,

		createApp: appResolvers.createApp,
		uploadFile: fileResolvers.uploadFile,

		createStoryCategory: storyCategoryResolvers.createStoryCategory,
		editStoryCategory: storyCategoryResolvers.editStoryCategory,
		deleteStoryCategory: storyCategoryResolvers.deleteStoryCategory,

		createStoryElement: storyElementResolvers.createStoryElement,
		editStoryElement: storyElementResolvers.editStoryElement
	}
}