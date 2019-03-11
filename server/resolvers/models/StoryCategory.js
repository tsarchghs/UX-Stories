

const createStoryCategory = async (root,args,context) => {
	if (!args.storyCategoryInput.name) {
		throw new Error("name argument is empty!");
	}
	const storyCategory = await context.prisma.createStoryCategory({
		name: args.storyCategoryInput.name
	})
	return storyCategory;
}

const editStoryCategory = async (root,args,context) => {
	console.log(args.editStoryCategoryInput);
	if (!args.editStoryCategoryInput.name || !args.editStoryCategoryInput.id) {
		throw new Error("name or id argument is empty!");
	}
	const storyCategory = await context.prisma.updateStoryCategory({
		where: {
			id: args.editStoryCategoryInput.id
		},
		data: {
			name: args.editStoryCategoryInput.name
		}
	})
	return storyCategory;
} 

module.exports = {
	createStoryCategory,
	editStoryCategory
}