

const createStoryCategory = async (root,args,context) => {
	if (!args.storyCategoryInput.name) {
		throw new Error("name argument is empty!");
	}
	const storyCategory = await context.prisma.createStoryCategory({
		name: args.storyCategoryInput.name
	})
	return storyCategory;
} 


module.exports = {
	createStoryCategory
}