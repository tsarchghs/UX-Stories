
const createStoryElement = async (root,args,context) => {
	if (!args.storyElementInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.prisma.createStoryElement({
		name: args.storyElementInput.name
	})
	return storyElement;
}

const linkStoryElementToStory = async (root,args,context) => {
	if (!args.linkStoryElementToStoryInput.storyElement || !args.linkStoryElementToStoryInput.story){
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const story = await context.prisma.updateStory({
		where:{ id: args.linkStoryElementToStoryInput.story },
		data: {
			elements: {
				connect: { id: args.linkStoryElementToStoryInput.storyElement }
			}
		}
	})
	return story;
}

const editStoryElement = async (root,args,context) => {
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
	linkStoryElementToStory
}