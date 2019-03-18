const permissions = require("../permissions");

const createStoryElement = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyElementInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.prisma.createStoryElement({
		name: args.storyElementInput.name
	})
	return storyElement;
}

const storyElementToStory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyElementToStoryInput.storyElement || !args.storyElementToStoryInput.story){
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const story = await context.prisma.updateStory({
		where:{ id: args.storyElementToStoryInput.story },
		data: {
			elements: {
				[args.storyElementToStoryInput.type]: { id: args.storyElementToStoryInput.storyElement }
			}
		}
	})
	return story;
}

const editStoryElement = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.editStoryElementInput.name || !args.editStoryElementInput.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.prisma.updateStoryElement({
		where: {
			id: args.editStoryElementInput.id
		},
		data: {
			name: args.editStoryElementInput.name
		}
	})
	return storyElement
}

const deleteStoryElement = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.deleteStoryElementInput.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.prisma.deleteStoryElement({
		id: args.deleteStoryElementInput.id
	})
	return storyElement;
}


module.exports = {
	createStoryElement,
	editStoryElement,
	deleteStoryElement,
	storyElementToStory
}