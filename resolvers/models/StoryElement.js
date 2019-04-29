const permissions = require("../permissions");

const storyElements = (root,args,context,info) => {
	let filterBy = { "where": {} }
	if (args.app || args.library) {
		let stories_some = {}
		if (args.app) stories_some["app"] = { id_in: args.app }
		if (args.library) stories_some["libraries_some"] = { id: args.library }
		filterBy["where"]["stories_some"] = stories_some
	}
	return context.db.query.storyElements(filterBy,info);
}

const createStoryElement = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.db.mutation.createStoryElement({
		data:{
			name: args.name
		}
	},info)
	return storyElement;
}

const storyElementToStory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyElement || !args.story){
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const story = await context.db.mutation.updateStory({
		where:{ id: args.story },
		data: {
			storyElements: {
				[args.type]: { id: args.storyElement }
			}
		}
	},info)
	return story;
}

const editStoryElement = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name || !args.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.db.mutation.updateStoryElement({
		where: {
			id: args.id
		},
		data: {
			name: args.name
		}
	},info)
	return storyElement
}

const deleteStoryElement = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.db.mutation.deleteStoryElement({
		where:{
			id: args.id
		}
	},info)
	return storyElement;
}



module.exports = {
	storyElements,
	createStoryElement,
	storyElementToStory,
	editStoryElement,
	deleteStoryElement
}