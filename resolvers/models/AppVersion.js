const permissions = require("../permissions");

const appVersions = (root, args, context) => {
	const where = {};
	if (args.app) {
		where.stories = {
			some: {
				appId: args.app
			}
		};
	}
	return context.db.appVersion.findMany({ where });
};

const createAppVersion = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name) {
		throw new Error("name argument is empty");
	}
	return context.db.appVersion.create({
		data: {
			name: args.name
		}
	});
};

const appVersionToApp = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.appVersion || !args.app) {
		throw new Error("appVersion and/or app argument is empty");
	}
	return context.db.app.update({
		where: { id: args.app },
		data: {
			appVersions: {
				[args.type]: { id: args.appVersion }
			}
		}
	});
};

const appVersionToStory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.appVersion || !args.story) {
		throw new Error("appVersion and/or story argument is empty");
	}
	return context.db.story.update({
		where: { id: args.story },
		data: {
			appVersions: {
				[args.type]: { id: args.appVersion }
			}
		}
	});
};

const editAppVersion = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name || !args.id) {
		throw new Error("version/id argument is empty");
	}
	return context.db.appVersion.update({
		where: {
			id: args.id
		},
		data: {
			name: args.name
		}
	});
};

const deleteAppVersion = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.id) {
		throw new Error("id argument is empty");
	}
	return context.db.appVersion.delete({
		where: {
			id: args.id
		}
	});
};

module.exports = {
	appVersions,
	createAppVersion,
	appVersionToApp,
	appVersionToStory,
	editAppVersion,
	deleteAppVersion
};
