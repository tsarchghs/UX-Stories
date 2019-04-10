const authResolvers = require("./authentication");
const userResolvers = require("./models/User");
const storyCategoryResolvers = require("./models/StoryCategory");
const appCategoryResolvers = require("./models/AppCategory");
const storyElementResolvers = require("./models/StoryElement");
const appVersionResolvers = require("./models/AppVersion");
const appResolvers = require("./models/App");
const fileResolvers = require("./models/File");
const libraryResolvers = require("./models/Library");
const storyResolvers = require("./models/Story");
const jobResolvers = require("./models/Job");

module.exports = {
	Query: {
		login: authResolvers.login,
		getLoggedInUser: userResolvers.getLoggedInUser,
		app: appResolvers.app,
		apps: appResolvers.apps,
		appCategories: appCategoryResolvers.appCategories,
		appVersions: appVersionResolvers.appVersions,
		story: storyResolvers.story,
		stories: storyResolvers.stories,
		storyCategories: storyCategoryResolvers.storyCategories,
		storyElements: storyElementResolvers.storyElements,
		library: libraryResolvers.library,
		libraries: libraryResolvers.libraries,
		jobs: jobResolvers.jobs
	},
	Mutation: {
		signUp: authResolvers.signUp,
		verifyForgotPassword: authResolvers.verifyForgotPassword,
		resetPassword: authResolvers.resetPassword,
		forgetPassword: authResolvers.forgetPassword,
		editProfile: userResolvers.editProfile,
		createApp: appResolvers.createApp,
		editApp: appResolvers.editApp,
		createAppCategory: appCategoryResolvers.createAppCategory,
		editAppCategory: appCategoryResolvers.editAppCategory,
		deleteAppCategory: appCategoryResolvers.deleteAppCategory,
		createAppVersion: appVersionResolvers.createAppVersion,
		appVersionToApp: appVersionResolvers.appVersionToApp,
		appVersionToStory: appVersionResolvers.appVersionToStory,
		editAppVersion: appVersionResolvers.editAppVersion,
		deleteAppVersion: appVersionResolvers.deleteAppVersion,
		createLibrary: libraryResolvers.createLibrary,
		editLibrary: libraryResolvers.editLibrary,
		createStory: storyResolvers.createStory,
		editStory: storyResolvers.editStory,
		storyToLibrary: storyResolvers.storyToLibrary,
		storyToApp: storyResolvers.storyToApp,
		createStoryCategory: storyCategoryResolvers.createStoryCategory,
		storyCategoryToStory: storyCategoryResolvers.storyCategoryToStory,
		editStoryCategory: storyCategoryResolvers.editStoryCategory,
		deleteStoryCategory: storyCategoryResolvers.deleteStoryCategory,
		createStoryElement: storyElementResolvers.createStoryElement,
		storyElementToStory: storyElementResolvers.storyElementToStory,
		editStoryElement: storyElementResolvers.editStoryElement,
		deleteStoryElement: storyElementResolvers.deleteStoryElement,
		createJob: jobResolvers.createJob,
		editJob: jobResolvers.editJob,
		deleteJob: jobResolvers.deleteJob,
		uploadFile: fileResolvers.uploadFile
	},
	App: {
		stories: appResolvers.stories
	}
}
