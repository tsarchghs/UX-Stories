
const appCategories = (root,args,context,info) => {
	return context.db.query.appCategories({},info);
}

const createAppCategory = async (root,args,context,info) => {
	if (!args.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const appCategory = await context.db.mutation.createAppCategory({
		data:{
			name: args.name
		}
	},info)
	return appCategory
}

const editAppCategory = async (root,args,context,info) => {
	if (!args.name || !args.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const appCategory = await context.db.mutation.updateAppCategory({
		where:{
			id: args.id
		},
		data: {
			name: args.name
		}
	},info)
	return appCategory
}

const deleteAppCategory = async (root,args,context,info) => {
	if (!args.id) {
		throw new Error("id argument is empty")
	}
	const appCategory = await context.db.mutation.deleteAppCategory({
		where:{
			id: args.id
		}
	},info)
	return appCategory
}

module.exports = {
	appCategories,
	createAppCategory,
	editAppCategory,
	deleteAppCategory
}