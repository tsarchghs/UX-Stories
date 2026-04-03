const permissions = require("../permissions");

const storyCategories = (root, args, context) => {
	const where = {};
	if (args.app || args.library) {
		const storiesSome = {};
		if (args.app) {
			storiesSome.appId = args.app;
		}
		if (args.library) {
			storiesSome.libraries = {
				some: { id: args.library }
			};
		}
		where.stories = {
			some: storiesSome
		};
	}
	return context.db.storyCategory.findMany({ where });
};

const createStoryCategory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name) {
		throw new Error("name argument is empty!");
	}
	return context.db.storyCategory.create({
		data: {
			name: args.name
		}
	});
};

const storyCategoryToStory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.storyCategory || !args.story) {
		throw new Error("name argument is empty!");
	}
	return context.db.story.update({
		where: { id: args.story },
		data: {
			storyCategories: {
				[args.type]: { id: args.storyCategory }
			}
		}
	});
};

const editStoryCategory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name || !args.id) {
		throw new Error("name or id argument is empty!");
	}
	return context.db.storyCategory.update({
		where: {
			id: args.id
		},
		data: {
			name: args.name
		}
	});
};

const deleteStoryCategory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.id) {
		throw new Error("id argument is empty!");
	}
	return context.db.storyCategory.delete({
		where: {
			id: args.id
		}
	});
};

module.exports = {
	storyCategories,
	createStoryCategory,
	storyCategoryToStory,
	editStoryCategory,
	deleteStoryCategory
};
