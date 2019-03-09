const authResolvers = require("./authentication");
const appCategoryResolvers = require("./models/AppCategory");
const appVersionResolvers = require("./models/AppVersion");
const appResolvers = require("./models/App");
const appStoryCategoryResolvers = require("./models/StoryCategory");
const fileResolvers = require("./models/File");

module.exports = {
	Query: {
		login: authResolvers.login
	},
	Mutation: {
		signUp: authResolvers.signUp,
		createAppCategory: appCategoryResolvers.createAppCategory,
		createAppVersion: appVersionResolvers.createAppVersion,
		createApp: appResolvers.createApp,
		uploadFile: fileResolvers.uploadFile,
		createStoryCategory: appStoryCategoryResolvers.createStoryCategory
	}
}