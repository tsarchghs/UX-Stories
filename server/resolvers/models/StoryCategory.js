
const storyCategories = async (root,args,context) => {
	return await context.prisma.storyCategories();
}

const createStoryCategory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyCategoryInput.name) {
		throw new Error("name argument is empty!");
	}
	const storyCategory = await context.prisma.createStoryCategory({
		name: args.storyCategoryInput.name
	})
	return storyCategory;
}


const storyCategoryToStory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyCategoryToStoryInput.storyCategory || !args.storyCategoryToStoryInput.story) {
		throw new Error("name argument is empty!");
	}
	const story = await context.prisma.updateStory({
		where: { id: args.storyCategoryToStoryInput.story },
		data: {
			categories: {
				[args.storyCategoryToStoryInput.type]: {id: args.storyCategoryToStoryInput.storyCategory }
			}
		}
	})
	return story
}

const editStoryCategory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
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
	permissions.loginPermission(context,"ADMIN")
	if (!args.deleteStoryCategoryInput.id) {
		throw new Error("id argument is empty!");
	}
	const storyCategory = await context.prisma.deleteStoryCategory({
		id: args.deleteStoryCategoryInput.id
	})
	return storyCategory
}

const stories = async (parent,args,context) => {
	return await context.prisma.stories({
		where:{
			categories_some:{
				id: parent.id
			}
		}
	})
}

module.exports = {
	createStoryCategory,
	editStoryCategory,
	deleteStoryCategory,
	storyCategoryToStory,
	storyCategories,
	stories
}