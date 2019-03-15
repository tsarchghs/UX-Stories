
const apps = async (root,args,context) => {
	const userId = "cjsxdc4kg35h90b3039qediof";
	const createBy = await context.prisma.user({id:userId});
	const apps = await context.prisma.apps({
		where: {
			createBy: createBy
		}
	})
	return apps;
}

const createApp = async (root,args,context) => {
	if (!args.appInput.name || !args.appInput.description || !args.appInput.platform || !args.appInput.logo_url
		 || !args.appInput.version || !args.appInput.category) {
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
	const logo = await context.prisma.file({url:args.appInput.logo_url});
	if (!logo) {
		throw new Error(`Logo <${args.appInput.logo_url}> doesn't exist`);
	}
	const userId = "cjsxdc4kg35h90b3039qediof";
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
	app.logo = logo	
	app.versions = [appVersion]	
	app.category = appCategory
	return app
}

module.exports = {
	createApp,
	apps
}