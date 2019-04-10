const permissions = require("../permissions");

const storyCategories = (root,args,context,info) => {
	return context.db.query.storyCategories({},info);
}

const createStoryCategory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name) {
		throw new Error("name argument is empty!");
	}
	const storyCategory = await context.db.mutation.createStoryCategory({
		data:{
			name: args.name
		}
	},info)
	return storyCategory;
}

const storyCategoryToStory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyCategory || !args.story) {
		throw new Error("name argument is empty!");
	}
	const story = await context.db.mutation.updateStory({
		where: { id: args.story },
		data: {
			storyCategories: {
				[args.type]: {id: args.storyCategory }
			}
		}
	},info)
	return story
}

const editStoryCategory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name || !args.id) {
		throw new Error("name or id argument is empty!");
	}
	const storyCategory = await context.db.mutation.updateStoryCategory({
		where: {
			id: args.id
		},
		data: {
			name: args.name
		}
	},info);
	return storyCategory;
}

const deleteStoryCategory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.id) {
		throw new Error("id argument is empty!");
	}
	const storyCategory = await context.db.mutation.deleteStoryCategory({
		where:{
			id: args.id
		}
	},info)
	return storyCategory
}

module.exports = {
	storyCategories,
	createStoryCategory,
	storyCategoryToStory,
	editStoryCategory,
	deleteStoryCategory
}