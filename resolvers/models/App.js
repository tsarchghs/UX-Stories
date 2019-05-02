const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");

const countApps = async (root,args,context) => {
	let data = await context.db.query.appsConnection({},`
			{
				aggregate { count }
			}
		`)
	return data.aggregate.count
}

const app = async (root,args,context,info) => {
	return await context.db.query.app({
		where: {
			id: args.id
		}
	},info)
}

const apps = async (root,args,context,info) => {
	if (args.appFilterInput && 
		!(args.appFilterInput.stories_first || args.appFilterInput.appName_contains !== undefined || args.appFilterInput.appName_contains || 
			args.appFilterInput.first || args.appFilterInput.orderBy || args.appFilterInput.skip || args.appFilterInput.id ||
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
		throw new Error("You must specifiy either one of id,first,orderBy,stories_first,appCategory/storyCategory or storyElements arguments when passing appFilterInput.");
	}
	const filterBy = {where:{

	}}
	if (args.appFilterInput && args.appFilterInput.orderBy){
		filterBy["orderBy"] = args.appFilterInput.orderBy;
	}
	if (args.appFilterInput && args.appFilterInput.id){
		filterBy["where"]["id"] = args.appFilterInput.id
	}
	if (args.appFilterInput && args.appFilterInput.appCategory) {
		if (!(args.appFilterInput.appCategory === "all")){
			filterBy["where"]["appCategory"] = {id:args.appFilterInput.appCategory}
		}
	}
	if (args.appFilterInput && args.appFilterInput.storyCategories && args.appFilterInput.storyCategories.length) {
		filterBy["where"]["stories_some"] = {
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
	if (args.appFilterInput && (args.appFilterInput.appName_contains !== undefined)){
		filterBy["where"]["name_contains"] = args.appFilterInput.appName_contains
	}
	var direct = ["first","skip"];
	for (var x in direct){
		if (args.appFilterInput && args.appFilterInput[direct[x]]){
			filterBy[direct[x]] = args.appFilterInput[direct[x]]
		}
	}
	const apps = await context.db.query.apps(filterBy,info);
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
	const appVersion = await context.db.query.appVersions({where:{name:args.appVersion}});
	let appVersionLinkType = undefined;
	let appVersionObj = undefined
	if (appVersion.length) {
		appVersionLinkType = "connect";
		appVersionObj = { id: appVersion[0].id }
	} else {
		appVersionLinkType = "create";
		appVersionObj = { name: args.appVersion }
	}

	const createBy = context.user
	let data =  {
		createdBy: {
			connect: {
				id: createBy.id
			}
		},
		name: args.name,
		description: args.description,
		company: args.company,
		appVersions: {
			[appVersionLinkType]: appVersionObj
		},
		appCategory: {
			connect: {
				name: args.appCategory
			}
		},
		logo: {
			connect: {
				id: logo.id
			}
		},
		platform: args.platform
	}
	const app = await context.db.mutation.createApp({
		data
	},info);
	return app
}

const editApp = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.id){
		throw new Error("id argument is required"); 
	}
	if (args.name || args.description || args.platform || args.company ||
		(args.logo && args.logo.base64 && args.logo.mimetype) || 
		 args.appCategory || (args.appVersions && args.appVersions.length)
	){		
		let data = {};
		let nonrelations = ["name","description","platform","company"]
		for (var x in nonrelations){
			if (args[nonrelations[x]]){
				data[nonrelations[x]] = args[nonrelations[x]];
			}
		}
		if (args.logo && args.logo.base64 && args.logo.mimetype){
			const logo = await fileHandling.processUpload(args.logo.base64,
															args.logo.mimetype,
															context);
			data["logo"] = {connect:{id:logo.id}}
		}
		if (args.appCategory){
			data["appCategory"] = {connect:{id:args.appCategory}}
		}
		if (args.appVersions && args.appVersions.length){
			let links = {}
			args.appVersions.map(x => {
				links[x.type] = {id:x.appVersion
			}});	
			data["appVersions"] = links
		}
		let app = await context.db.mutation.updateApp({data,where:{id:args.id}});
		return app
	} else {
		throw new Error("At least an argument besides id must be specified");
	}
}

const stories = async (parent,args,context,info) => {
	let where = {
		app: { id: parent.id }
	}
	return await context.db.query.stories({where,first:args.first,skip:args.skip},info)
}
 
module.exports = {
	countApps,
	app,
	apps,
	createApp,
	editApp,
	stories
}