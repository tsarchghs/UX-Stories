

const createStoryCategory = async (root,args,context) => {
	if (!args.storyCategoryInput.name) {
		throw new Error("name argument is empty!");
	}
	const exists = await context.prisma.storyCategories({where:{name:args.storyCategoryInput.name}});
	if (exists.length){
		throw new Error("Story category already exists (use different name)");
	}
	const storyCategory = await context.prisma.createStoryCategory({
		name: args.storyCategoryInput.name
	})
	return storyCategory;
}

const editStoryCategory = async (root,args,context) => {
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

const deleteStoryCategory = async (root,args,context) => {
	if (!args.deleteStoryCategoryInput.id) {
		throw new Error("id argument is empty!");
	}
	const storyCategory = await context.prisma.deleteStoryCategory({
		id: args.deleteStoryCategoryInput.id
	})
	return storyCategory
}


module.exports = {
	createStoryCategory,
	editStoryCategory,
	deleteStoryCategory
}