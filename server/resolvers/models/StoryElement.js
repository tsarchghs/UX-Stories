
const createStoryElement = async (root,args,context) => {
	if (!args.storyElementInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const storyElement = await context.prisma.createStoryElement({
		name: args.storyElementInput.name
	})
	return storyElement;
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

module.exports = {
	createStoryElement,
	editStoryElement
}