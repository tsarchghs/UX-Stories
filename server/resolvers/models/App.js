const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");

const app = async (root,args,context,info) => {
	return await context.db.query.app({
		where: {
			id: args.id
		}
	},info)
}

const apps = async (root,args,context,info) => {
	if (args.appFilterInput && 
		!(args.appFilterInput.id || args.appFilterInput.appCategory ||
			(
				args.appFilterInput.storyCategories &&
				args.appFilterInput.storyCategories.length
			)
			 ||
			(
				args.appFilterInput.storyElements &&
				args.appFilterInput.storyElements.length
			)
		)
	){
		throw new Error("You must specifiy either one of id,appCategory/storyCategory or storyElements arguments when passing appFilterInput.");
	}
	const filterBy = {where:{}}
	if (args.appFilterInput && args.appFilterInput.id){
		filterBy["where"]["id"] = args.appFilterInput.id
	}
	if (args.appFilterInput && args.appFilterInput.appCategory) {
		filterBy["where"]["appCategory"] = {name:args.appFilterInput.appCategory}
	}
	if (args.appFilterInput && args.appFilterInput.storyCategories && args.appFilterInput.storyCategories.length) {
		filterBy["where"]["stories_every"] = {
			AND: args.appFilterInput.storyCategories.map(storyCategory => (
					{
						storyCategories_some:{
							id: storyCategory
						}
					}
				))
		}
	}
	if (args.appFilterInput && args.appFilterInput.storyElements && args.appFilterInput.storyElements.length){
		filterBy["where"]["stories_every"] = {
			AND: args.appFilterInput.storyElements.map(storyElement => (
					{			
						storyElements_some: {
							id: storyElement
						}
					}
				))
		}
	}
	const apps = await context.db.query	.apps(filterBy,info);
	return apps;
}


const createApp = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name || !args.description || !args.platform || !args.logo.base64 ||
		 !args.logo.mimetype || !args.appVersion || !args.appCategory) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const appCategory = await context.db.query.appCategory({where:{name:args.appCategory}});
	if (!appCategory){
		throw new Error(`Category <${args.appCategory}> doesn't exist`);
	}
	const logo = await fileHandling.processUpload(args.logo.base64,
													args.logo.mimetype,
													context);
	const createBy = context.user
	const app = await context.db.mutation.createApp({
		data: {
			createdBy: {
				connect: {
					id: createBy.id
				}
			},
			name: args.name,
			description: args.description,
			company: args.company,
			appVersions: {
				create: {
					name: args.appVersion
				}
			},
			appCategory: {
				connect: {
					id: appCategory.id
				}
			},
			logo: {
				connect: {
					id: logo.id
				}
			},
			platform: args.platform
		}
	},info);
	return app
}

module.exports = {
	app,
	apps,
	createApp
}