const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");
const { legacyOrderBy } = require("../../prismaHelpers");

const countStories = async (root, args, context) => {
	return context.db.story.count();
};

const story = async (root, args, context) => {
	return context.db.story.findUnique({
		where: { id: args.id }
	});
};

const stories = async (root, args, context) => {
	const where = { AND: [] };
	if (args.storiesFilterInput) {
		if (args.storiesFilterInput.app) {
			where.appId = args.storiesFilterInput.app;
		}
		if (args.storiesFilterInput.inLibrary) {
			where.libraries = {
				some: { id: args.storiesFilterInput.inLibrary }
			};
		}
		if (args.storiesFilterInput.storyName_contains) {
			where.AND = [{
				storyCategories: {
					some: {
						name: { contains: args.storiesFilterInput.storyName_contains }
					}
				}
			}];
		}
		if (args.storiesFilterInput.appCategory && args.storiesFilterInput.appCategory !== "all") {
			where.app = {
				is: {
					appCategoryId: args.storiesFilterInput.appCategory
				}
			};
		}
		if (args.storiesFilterInput.storyCategories && args.storiesFilterInput.storyCategories.length) {
			where.AND = where.AND.concat(
				args.storiesFilterInput.storyCategories.map(storyCategory => ({
					storyCategories: {
						some: { id: storyCategory }
					}
				}))
			);
		}
		if (args.storiesFilterInput.storyElements && args.storiesFilterInput.storyElements.length) {
			where.AND = where.AND.concat(
				args.storiesFilterInput.storyElements.map(storyElement => ({
					storyElements: {
						some: { id: storyElement }
					}
				}))
			);
		}
		if (args.storiesFilterInput.appVersions && args.storiesFilterInput.appVersions.length) {
			where.AND = where.AND.concat(
				args.storiesFilterInput.appVersions.map(appVersion => ({
					appVersions: {
						some: { id: appVersion }
					}
				}))
			);
		}
	}

	const prismaArgs = {
		where
	};
	if (args.storiesFilterInput && args.storiesFilterInput.first) {
		prismaArgs.take = args.storiesFilterInput.first;
	}
	if (args.storiesFilterInput && args.storiesFilterInput.skip) {
		prismaArgs.skip = args.storiesFilterInput.skip;
	}
	if (args.storiesFilterInput && args.storiesFilterInput.orderBy) {
		prismaArgs.orderBy = legacyOrderBy(args.storiesFilterInput.orderBy);
	}
	return context.db.story.findMany(prismaArgs);
};

const createStory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.app || !args.video || !args.thumbnail || !args.appVersions ||
		!args.storyCategories || !args.storyElements) {
		throw new Error("Please make sure that all of your arguments are non empty!");
	}

	const videoFile = await fileHandling.processUpload(args.video.base64, args.video.mimetype, context);
	const thumbnail = await fileHandling.processUpload(args.thumbnail.base64, args.thumbnail.mimetype, context);

	return context.db.story.create({
		data: {
			createdBy: {
				connect: { id: context.user.id }
			},
			app: {
				connect: { id: args.app }
			},
			video: {
				create: {
					file: {
						connect: { id: videoFile.id }
					}
				}
			},
			thumbnail: {
				connect: { id: thumbnail.id }
			},
			appVersions: {
				connect: args.appVersions.map(id => ({ id }))
			},
			storyCategories: {
				connect: args.storyCategories.map(id => ({ id }))
			},
			storyElements: {
				connect: args.storyElements.map(id => ({ id }))
			}
		}
	});
};

const editStory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.id) {
		throw new Error("id argument is required");
	}
	if (
		args.app ||
		(args.appVersions && args.appVersions.length) ||
		(args.storyCategories && args.storyCategories.length) ||
		(args.storyElements && args.storyElements.length) ||
		(args.video && args.video.base64 && args.video.mimetype) ||
		(args.thumbnail && args.thumbnail.base64 && args.thumbnail.mimetype)
	) {
		const data = {};
		if (args.app) {
			data.app = {
				connect: { id: args.app }
			};
		}
		if (args.storyElements && args.storyElements.length) {
			const connect = [];
			const disconnect = [];
			args.storyElements.forEach(item => {
				if (item.type === "connect") {
					connect.push({ id: item.storyElement });
				}
				if (item.type === "disconnect") {
					disconnect.push({ id: item.storyElement });
				}
			});
			data.storyElements = {};
			if (connect.length) {
				data.storyElements.connect = connect;
			}
			if (disconnect.length) {
				data.storyElements.disconnect = disconnect;
			}
		}
		if (args.appVersions && args.appVersions.length) {
			const connect = [];
			const disconnect = [];
			args.appVersions.forEach(item => {
				if (item.type === "connect") {
					connect.push({ id: item.appVersion });
				}
				if (item.type === "disconnect") {
					disconnect.push({ id: item.appVersion });
				}
			});
			data.appVersions = {};
			if (connect.length) {
				data.appVersions.connect = connect;
			}
			if (disconnect.length) {
				data.appVersions.disconnect = disconnect;
			}
		}
		if (args.storyCategories && args.storyCategories.length) {
			const connect = [];
			const disconnect = [];
			args.storyCategories.forEach(item => {
				if (item.type === "connect") {
					connect.push({ id: item.storyCategory });
				}
				if (item.type === "disconnect") {
					disconnect.push({ id: item.storyCategory });
				}
			});
			data.storyCategories = {};
			if (connect.length) {
				data.storyCategories.connect = connect;
			}
			if (disconnect.length) {
				data.storyCategories.disconnect = disconnect;
			}
		}
		if (args.thumbnail && args.thumbnail.base64 && args.thumbnail.mimetype) {
			const thumbnail = await fileHandling.processUpload(args.thumbnail.base64, args.thumbnail.mimetype, context);
			data.thumbnail = { connect: { id: thumbnail.id } };
		}
		if (args.video && args.video.base64 && args.video.mimetype) {
			const videoFile = await fileHandling.processUpload(args.video.base64, args.video.mimetype, context);
			const video = await context.db.video.create({
				data: {
					file: {
						connect: { id: videoFile.id }
					}
				}
			});
			data.video = { connect: { id: video.id } };
		}
		return context.db.story.update({
			data,
			where: { id: args.id }
		});
	}
	throw new Error("At least an argument other than id must be specified");
};

const storyToLibrary = async (root, args, context) => {
	permissions.loginPermission(context, "MEMBER");
	if (!args.story || !args.library) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	await permissions.storyToLibraryPermission(context, args.library);
	return context.db.library.update({
		where: { id: args.library },
		data: {
			stories: {
				[args.type]: { id: args.story }
			}
		}
	});
};

const storyToApp = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.story || !args.app) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.story.update({
		where: { id: args.story },
		data: {
			app: {
				connect: { id: args.app }
			}
		}
	});
};

const Story = {
	app: (parent, args, context) => context.db.app.findUnique({
		where: { id: parent.appId }
	}),
	appVersions: async (parent, args, context) => {
		const record = await context.db.story.findUnique({
			where: { id: parent.id },
			select: { appVersions: true }
		});
		return record ? record.appVersions : [];
	},
	storyCategories: async (parent, args, context) => {
		const record = await context.db.story.findUnique({
			where: { id: parent.id },
			select: { storyCategories: true }
		});
		return record ? record.storyCategories : [];
	},
	storyElements: async (parent, args, context) => {
		const record = await context.db.story.findUnique({
			where: { id: parent.id },
			select: { storyElements: true }
		});
		return record ? record.storyElements : [];
	},
	libraries: async (parent, args, context) => {
		const record = await context.db.story.findUnique({
			where: { id: parent.id },
			select: { libraries: true }
		});
		return record ? record.libraries : [];
	},
	video: (parent, args, context) => context.db.video.findUnique({
		where: { id: parent.videoId }
	}),
	thumbnail: (parent, args, context) => context.db.file.findUnique({
		where: { id: parent.thumbnailId }
	})
};

module.exports = {
	countStories,
	stories,
	createStory,
	storyToLibrary,
	storyToApp,
	editStory,
	story,
	Story
};
