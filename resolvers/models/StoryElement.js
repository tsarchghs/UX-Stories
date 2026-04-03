const permissions = require("../permissions");

const storyElements = (root, args, context) => {
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
	return context.db.storyElement.findMany({ where });
};

const createStoryElement = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.storyElement.create({
		data: {
			name: args.name
		}
	});
};

const storyElementToStory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.storyElement || !args.story) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.story.update({
		where: { id: args.story },
		data: {
			storyElements: {
				[args.type]: { id: args.storyElement }
			}
		}
	});
};

const editStoryElement = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name || !args.id) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.storyElement.update({
		where: {
			id: args.id
		},
		data: {
			name: args.name
		}
	});
};

const deleteStoryElement = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.id) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.storyElement.delete({
		where: {
			id: args.id
		}
	});
};

module.exports = {
	storyElements,
	createStoryElement,
	storyElementToStory,
	editStoryElement,
	deleteStoryElement
};
