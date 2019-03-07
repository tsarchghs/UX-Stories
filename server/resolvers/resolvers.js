const authResolvers = require("./authentication");
const appCategoryResolvers = require("./models/AppCategory");
const appVersionResolvers = require("./models/AppVersion");
const appResolvers = require("./models/App");

module.exports = {
	Query: {
		login: authResolvers.login
	},
	Mutation: {
		signUp: authResolvers.signUp,
		createAppCategory: appCategoryResolvers.createAppCategory,
		createAppVersion: appVersionResolvers.createAppVersion,
		createApp: appResolvers.createApp
	}
}