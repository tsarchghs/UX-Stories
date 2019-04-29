const permissions = require("../permissions");

const storyCategories = (root,args,context,info) => {
	let filterBy = {"where":{}}
	if (args.app || args.library){
		let stories_some = {}
		if (args.app) stories_some["app"] = { id_in: args.app }
		if (args.library) stories_some["libraries_some"] = { id: args.library }
		console.log(stories_some);
		filterBy["where"]["stories_some"] = stories_some
	}
	return context.db.query.storyCategories(filterBy,info);
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