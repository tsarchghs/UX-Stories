const permissions = require("../permissions");

const appCategories = (root, args, context) => {
	return context.db.appCategory.findMany();
};

const createAppCategory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.appCategory.create({
		data: {
			name: args.name
		}
	});
};

const editAppCategory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.name || !args.id) {
		throw new Error("Please check that all of your arguments are not empty!");
	}
	return context.db.appCategory.update({
		where: {
			id: args.id
		},
		data: {
			name: args.name
		}
	});
};

const deleteAppCategory = async (root, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	if (!args.id) {
		throw new Error("id argument is empty");
	}
	return context.db.appCategory.delete({
		where: {
			id: args.id
		}
	});
};

module.exports = {
	appCategories,
	createAppCategory,
	editAppCategory,
	deleteAppCategory
};
