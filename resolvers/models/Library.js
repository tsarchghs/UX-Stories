const permissions = require("../permissions");
const { checkValidation } = require("../../helpers.js");
const {
	librariesSchema,
	librarySchema,
	createLibrarySchema,
	editLibrarySchema
} = require("../../validations/libraryValidations.js");

const library = async (root, args, context) => {
	await checkValidation(librarySchema, args);
	return context.db.library.findFirst({
		where: {
			id: args.id,
			createdById: context.user.id
		}
	});
};

const toggleStoryLibrary = async (root, args, context) => {
	permissions.loginPermission(context, "MEMBER");
	const libraryWhere = {
		id: args.library,
		createdById: context.user.id
	};
	const existing = await context.db.library.findFirst({
		where: libraryWhere,
		select: {
			id: true,
			name: true,
			stories: {
				select: { id: true }
			}
		}
	});
	if (!existing) {
		throw new Error("library not found");
	}
	let type = "connect";
	existing.stories.forEach(story => {
		if (story.id === args.story) {
			type = "disconnect";
		}
	});
	const updated_library = await context.db.library.update({
		data: {
			stories: {
				[type]: { id: args.story }
			},
			custom_updatedAt: new Date()
		},
		where: { id: args.library }
	});
	return {
		action: type,
		library: updated_library
	};
};

const libraries = async (root, args, context) => {
	await checkValidation(librariesSchema, args);
	permissions.loginPermission(context, "MEMBER");

	const where = {
		createdById: context.user.id,
		stories: {
			every: {}
		}
	};

	if (args.libraryFilterInput) {
		if (args.libraryFilterInput.containsStory) {
			where.stories.some = { id: args.libraryFilterInput.containsStory };
		}
		if (args.libraryFilterInput.storyCategories && args.libraryFilterInput.storyCategories.length) {
			where.stories.every = {
				AND: args.libraryFilterInput.storyCategories.map(storyCategory => ({
					storyCategories: {
						some: { name: storyCategory }
					}
				}))
			};
		}
		if (args.libraryFilterInput.storyElements && args.libraryFilterInput.storyElements.length) {
			if (where.stories.every.AND === undefined) {
				where.stories.every.AND = [];
			}
			where.stories.every.AND = where.stories.every.AND.concat(
				args.libraryFilterInput.storyElements.map(storyElement => ({
					storyElements: {
						some: { name: storyElement }
					}
				}))
			);
		}
	}

	return context.db.library.findMany({
		where,
		orderBy: {
			custom_updatedAt: "desc"
		}
	});
};

const createLibrary = async (root, args, context) => {
	await checkValidation(createLibrarySchema, args);
	permissions.loginPermission(context, "MEMBER");
	return context.db.library.create({
		data: {
			createdBy: {
				connect: { id: context.user.id }
			},
			custom_updatedAt: new Date(),
			name: args.name
		}
	});
};

const editLibrary = async (root, args, context) => {
	await checkValidation(editLibrarySchema, args);
	await permissions.libraryPermission(context, args.id);
	permissions.loginPermission(context, "MEMBER");

	const data = {};
	if (args.name) {
		data.name = args.name;
	}
	if (args.stories) {
		const connect = [];
		const disconnect = [];
		args.stories.forEach(story => {
			if (story.type === "connect") {
				connect.push({ id: story.story });
			}
			if (story.type === "disconnect") {
				disconnect.push({ id: story.story });
			}
		});
		data.stories = {};
		if (connect.length) {
			data.stories.connect = connect;
		}
		if (disconnect.length) {
			data.stories.disconnect = disconnect;
		}
	}
	data.custom_updatedAt = new Date();
	return context.db.library.update({
		where: { id: args.id },
		data
	});
};

const saveToLibrary = async (root, args, context) => {
	return context.db.library.update({
		where: { id: args.library_id },
		data: {
			stories: {
				connect: { id: args.story_id }
			}
		}
	});
};

const deleteLibrary = async (root, args, context) => {
	permissions.loginPermission(context, "MEMBER");
	await permissions.libraryPermission(context, args.id);
	return context.db.library.delete({
		where: { id: args.id }
	});
};

const Library = {
	createdBy: (parent, args, context) => context.db.user.findUnique({
		where: { id: parent.createdById }
	}),
	stories: async (parent, args, context) => {
		const record = await context.db.library.findUnique({
			where: { id: parent.id },
			select: { stories: true }
		});
		return record ? record.stories : [];
	}
};

module.exports = {
	library,
	libraries,
	createLibrary,
	editLibrary,
	toggleStoryLibrary,
	deleteLibrary,
	saveToLibrary,
	Library
};
