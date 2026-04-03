const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");
const { legacyOrderBy } = require("../../prismaHelpers");

const countApps = async (root, args, context) => {
	return context.db.app.count();
};

const app = async (root, args, context) => {
	if (args.contains_story) {
		return context.db.app.findFirst({
			where: {
				stories: {
					some: { id: args.contains_story }
				}
			}
		});
	}
	return context.db.app.findUnique({
		where: {
			id: args.id
		}
	});
};

const apps = async (root, args, context) => {
	if (
		args.appFilterInput &&
		!(
			args.appFilterInput.stories_first ||
			args.appFilterInput.appName_contains !== undefined ||
			args.appFilterInput.appName_contains ||
			args.appFilterInput.first ||
			args.appFilterInput.orderBy ||
			args.appFilterInput.skip ||
			args.appFilterInput.id ||
			(args.appFilterInput.storyCategories && args.appFilterInput.storyCategories.length) ||
			(args.appFilterInput.storyElements && args.appFilterInput.storyElements.length)
		)
	) {
		throw new Error("You must specifiy either one of id,first,orderBy,stories_first,appCategory/storyCategory or storyElements arguments when passing appFilterInput.");
	}

	const where = {};
	if (args.appFilterInput && args.appFilterInput.id) {
		where.id = args.appFilterInput.id;
	}
	if (args.appFilterInput && args.appFilterInput.appCategory && args.appFilterInput.appCategory !== "all") {
		where.appCategoryId = args.appFilterInput.appCategory;
	}
	if (args.appFilterInput && args.appFilterInput.storyCategories && args.appFilterInput.storyCategories.length) {
		where.stories = {
			some: {
				AND: args.appFilterInput.storyCategories.map(storyCategory => ({
					storyCategories: {
						some: { id: storyCategory }
					}
				}))
			}
		};
	}
	if (args.appFilterInput && args.appFilterInput.storyElements && args.appFilterInput.storyElements.length) {
		where.stories = {
			every: {
				AND: args.appFilterInput.storyElements.map(storyElement => ({
					storyElements: {
						some: { id: storyElement }
					}
				}))
			}
		};
	}
	if (args.appFilterInput && args.appFilterInput.appName_contains !== undefined) {
		where.name = { contains: args.appFilterInput.appName_contains };
	}

	const prismaArgs = { where };
	if (args.appFilterInput && args.appFilterInput.orderBy) {
		prismaArgs.orderBy = legacyOrderBy(args.appFilterInput.orderBy);
	}
	if (args.appFilterInput && args.appFilterInput.first) {
		prismaArgs.take = args.appFilterInput.first;
	}
	if (args.appFilterInput && args.appFilterInput.skip) {
		prismaArgs.skip = args.appFilterInput.skip;
	}

	return context.db.app.findMany(prismaArgs);
};

const createApp = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name || !args.description || !args.platform || !args.logo.base64 ||
		!args.logo.mimetype || !args.appVersion || !args.appCategory) {
		throw new Error("Please check that all of your arguments are not empty!");
	}

	const appCategory = await context.db.appCategory.findUnique({
		where: { name: args.appCategory }
	});
	if (!appCategory) {
		throw new Error(`Category <${args.appCategory}> doesn't exist`);
	}

	const logo = await fileHandling.processUpload(args.logo.base64, args.logo.mimetype, context);
	const appVersion = await context.db.appVersion.findUnique({
		where: { name: args.appVersion }
	});
	const data = {
		createdBy: {
			connect: {
				id: context.user.id
			}
		},
		name: args.name,
		description: args.description,
		company: args.company,
		appVersions: appVersion ? {
			connect: { id: appVersion.id }
		} : {
			create: { name: args.appVersion }
		},
		appCategory: {
			connect: {
				id: appCategory.id
			}
		},
		logo: {
			connect: {
				id: logo.id
			}
		},
		platform: args.platform
	};
	return context.db.app.create({ data });
};

const editApp = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.id) {
		throw new Error("id argument is required");
	}
	if (
		args.name ||
		args.description ||
		args.platform ||
		args.company ||
		(args.logo && args.logo.base64 && args.logo.mimetype) ||
		args.appCategory ||
		(args.appVersions && args.appVersions.length)
	) {
		const data = {};
		["name", "description", "platform", "company"].forEach(field => {
			if (args[field]) {
				data[field] = args[field];
			}
		});
		if (args.logo && args.logo.base64 && args.logo.mimetype) {
			const logo = await fileHandling.processUpload(args.logo.base64, args.logo.mimetype, context);
			data.logo = { connect: { id: logo.id } };
		}
		if (args.appCategory) {
			data.appCategory = { connect: { id: args.appCategory } };
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
		return context.db.app.update({
			data,
			where: { id: args.id }
		});
	}
	throw new Error("At least an argument besides id must be specified");
};

const App = {
	createdBy: (parent, args, context) => context.db.user.findUnique({
		where: { id: parent.createdById }
	}),
	appCategory: (parent, args, context) => context.db.appCategory.findUnique({
		where: { id: parent.appCategoryId }
	}),
	appVersions: async (parent, args, context) => {
		const record = await context.db.app.findUnique({
			where: { id: parent.id },
			select: { appVersions: true }
		});
		return record ? record.appVersions : [];
	},
	stories: async (parent, args, context) => {
		const record = await context.db.app.findUnique({
			where: { id: parent.id },
			select: {
				stories: {
					take: args.first || undefined,
					skip: args.skip || undefined
				}
			}
		});
		return record ? record.stories : [];
	},
	logo: (parent, args, context) => context.db.file.findUnique({
		where: { id: parent.logoId }
	})
};

module.exports = {
	countApps,
	app,
	apps,
	createApp,
	editApp,
	App
};
