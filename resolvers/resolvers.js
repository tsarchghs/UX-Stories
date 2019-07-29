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
const generalResolvers = require("./general");
const algoliaResolvers = require("./algolia");
const paymentResolvers = require("./payment");
const monitorResolvers = require("./monitor/");

module.exports = {
	Subscription: {
		getSystemCpuUsage: monitorResolvers.getSystemCpuUsage,
		getMemwatchStats: monitorResolvers.getMemwatchStats,
		getMemwatchLeak: monitorResolvers.getMemwatchLeak,
		getMemoryUsage: monitorResolvers.getMemoryUsage
	},
	Query: {
		getLoggedInUser: userResolvers.getLoggedInUser,
		countApps: appResolvers.countApps,
		app: appResolvers.app,
		apps: appResolvers.apps,
		appCategories: appCategoryResolvers.appCategories,
		appVersions: appVersionResolvers.appVersions,
		story: storyResolvers.story,
		countStories: storyResolvers.countStories,
		stories: storyResolvers.stories,
		storyCategories: storyCategoryResolvers.storyCategories,
		storyElements: storyElementResolvers.storyElements,
		library: libraryResolvers.library,
		libraries: libraryResolvers.libraries,
		countUsers: userResolvers.countUsers,
		jobs: jobResolvers.jobs,
		users: userResolvers.users,
		getObject: generalResolvers.getObject,
		getObjectConnection: generalResolvers.getObjectConnection
	},
	Mutation: {
		loginWithFacebook: authResolvers.loginWithFacebook,
		saveToLibrary: libraryResolvers.saveToLibrary,
		loginWithGoogle: authResolvers.loginWithGoogle,
		payment: paymentResolvers.payment,
		updateCard: paymentResolvers.updateCard,
		cancelSubscription: paymentResolvers.cancelSubscription,
		renewSubscription: paymentResolvers.renewSubscription,
		addAlgoliaIndex: algoliaResolvers.addAlgoliaIndex,
		updateAlgoliaIndex: algoliaResolvers.updateAlgoliaIndex,
		deleteAlgoliaIndex: algoliaResolvers.deleteAlgoliaIndex,
		createObject: generalResolvers.createObject,
		updateObject: generalResolvers.updateObject,
		deleteObject: generalResolvers.deleteObject,
		toggleStoryLibrary: libraryResolvers.toggleStoryLibrary,
		login: authResolvers.login,
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
		deleteLibrary: libraryResolvers.deleteLibrary,
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
	},
	User: userResolvers.User
}
