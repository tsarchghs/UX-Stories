
const createAppCategory = async (root,args,context) => {
	if (!args.appCategoryInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const exists = await context.prisma.appCategories({where:{name:args.appCategoryInput.name}});
	if (exists.length){
		throw new Error("Category already exists (use different name)");
	}
	const appCategory = await context.prisma.createAppCategory({
		name: args.appCategoryInput.name
	})
	return appCategory
}

const editAppCategory = async (root,args,context) => {
	if (!args.editAppCategoryInput.name || !args.editAppCategoryInput.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const appCategory = await context.prisma.updateAppCategory({
		where:{
			id: args.editAppCategoryInput.id
		},
		data: {
			name: args.editAppCategoryInput.name
		}
	})
	return appCategory
}

module.exports = {
	createAppCategory,
	editAppCategory
}