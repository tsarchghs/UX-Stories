const permissions = require("../permissions");

const storyCategories = (root,args,context,info) => {
	return context.db.query.storyCategories({},info);
}

const createStoryCategory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name) {
		throw new Error("name argument is empty!");
	}
	const storyCategory = await context.db.mutation.createStoryCategory({
		data:{
			name: args.name
		}
	})
	return storyCategory;
}

const storyCategoryToStory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.storyCategory || !args.story) {
		throw new Error("name argument is empty!");
	}
	const story = await context.prisma.updateStory({
		where: { id: args.story },
		data: {
			categories: {
				[args.type]: {id: args.storyCategory }
			}
		}
	})
	return story
}


module.exports = {
	storyCategories,
	createStoryCategory
}