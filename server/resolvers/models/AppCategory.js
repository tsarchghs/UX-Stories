
const createAppCategory = async (root,args,context) => {
	if (!args.appCategoryInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
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

const deleteAppCategory = async (root,args,context) => {
	if (!args.deleteAppCategoryInput.id) {
		throw new Error("id argument is empty")
	}
	const appCategory = await context.prisma.deleteAppCategory({
		id: args.deleteAppCategoryInput.id
	})
	return appCategory
}

module.exports = {
	createAppCategory,
	editAppCategory,
	deleteAppCategory
}