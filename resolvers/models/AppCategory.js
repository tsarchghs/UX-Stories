const permissions = require("../permissions");

const appCategories = (root,args,context,info) => {
	return context.db.query.appCategories({},info);
}

const appCategoriesConnection = async (root,args,context,info) => {
	let filterBy = {}
	if (args.first !== undefined) filterBy["first"] = args.first
	if (args.skip !== undefined) filterBy["skip"] = args.skip
	if (args.name_contains !== undefined) filterBy["where"] = { name_contains: args.name_contains}
	if (args.orderBy) filterBy["orderBy"] = args.orderBy;
	let data = await context.db.query.appCategoriesConnection(filterBy,`
	    {
	    	edges {
		      node {
						id
		        name
		    	}
		    }
		    aggregate {
		      count
		    }
		    pageInfo{
		      hasNextPage
		      hasPreviousPage
		    }
		}
	`);
	console.log(data);
	data.nodes = data.edges.map(edge => edge.node);
	return data;
}

const createAppCategory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
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
	permissions.loginPermission(context,"ADMIN")
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
	permissions.loginPermission(context,"ADMIN")
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
	appCategoriesConnection,
	createAppCategory,
	editAppCategory,
	deleteAppCategory
}