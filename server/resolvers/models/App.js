const fileHandling = require("../../modules/fileApi");

const apps = async (root,args,context) => {
	if (args.appFilterInput && !args.appFilterInput.category) {
		throw new Error("appFilterInput.category arg must not be empty");
	}
	filterBy = {}
	if (args.appFilterInput.category){
		filterBy["where"] = {}
		filterBy["where"]["category"] = {name:args.appFilterInput.category}
	}
	const apps = await context.prisma.apps(filterBy);
	return apps;
}

const createApp = async (root,args,context) => {
	if (!args.appInput.name || !args.appInput.description || !args.appInput.platform || !args.appInput.logo.base64 ||
		 !args.appInput.logo.mimetype || !args.appInput.version || !args.appInput.category) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const appCategory = await context.prisma.appCategory({name:args.appInput.category});
	if (!appCategory){
		throw new Error(`Category <${args.appInput.category}> doesn't exist`);
	}
	const appVersion = await context.prisma.appVersion({version:args.appInput.version});
	if (!appVersion){
		throw new Error(`Version <${args.appInput.version}> doesn't exist.`);
	}
	const logo = await fileHandling.processUpload(args.appInput.logo.base64,
													args.appInput.logo.mimetype,
													context);
	const userId = "cjtabbnzyqlww0b79zgo8k7ku";
	const createBy = await context.prisma.user({id:userId});
	const app = await context.prisma.createApp({
		createBy: {
			connect: {
				id: createBy.id
			}
		},
		name: args.appInput.name,
		description: args.appInput.description,
		company: args.appInput.company,
		versions: {
			connect: {
				id: appVersion.id
			}
		},
		category: {
			connect: {
				id: appCategory.id
			}
		},
		logo: {
			connect: {
				id: logo.id
			}
		},
		platform: args.appInput.platform
	})
	await context.prisma.updateFile({
		where:{id:logo.id},
		data: {
			apps: {
				connect: { id: app.id }
			}
		}
	})
	return app
}

const stories = async (parent,args,context) => {
	return await context.prisma.stories({
		where: {
			app: { id: parent.id }
		}
	})
}
const createBy = async (parent,args,context) => {
	const user = await context.prisma.users({
		where: {	
			apps_some: {
				id: parent.id
			}
		}
	});
	user[0].password = null;
	return user[0];
}

const versions = async (parent,args,context) =>{
	return  await context.prisma.appVersions({
		where: {
			apps_some: {
				id: parent.id
			}
		}
	})
}

const category = async (parent,args,context) => {
	const category = await context.prisma.appCategories({
		where: {
			apps_some: {
				id: parent.id
			}
		}
	})
	return category[0];
}

const logo = async (parent,args,context) => {
	const logo = await context.prisma.files({
		where: {
			apps_some: {
				id: parent.id
			}
		}
	})
	return logo[0];
}

module.exports = {
	createApp,
	apps,
	stories,
	createBy,
	versions,
	category,
	logo
}