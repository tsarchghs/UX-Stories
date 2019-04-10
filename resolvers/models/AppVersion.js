const permissions = require("../permissions");

const appVersions = (root,args,context,info) => {
	return context.db.query.appVersions({},info);
}

const createAppVersion = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name) {
		throw new Error("name argument is empty")
	}
	const appVersion = await context.db.mutation.createAppVersion({
		data:{
			name: args.name
		}
	},info)
	return appVersion
}

const appVersionToApp = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.appVersion || !args.app) {
		throw new Error("appVersion and/or app argument is empty")
	}
	const app = await context.db.mutation.updateApp({
		where: {id:args.app},
		data: {
			appVersions: {
				[args.type]: { id: args.appVersion }
			}
		}
	},info);
	return app
}

const appVersionToStory = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.appVersion || !args.story) {
		throw new Error("appVersion and/or story argument is empty")
	}
	const story = await context.db.mutation.updateStory({
		where: {id:args.story},
		data: {
			appVersions: {
				[args.type]: { id: args.appVersion }
			}
		}
	},info)
	return story
}

const editAppVersion = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.name || !args.id) {
		throw new Error("version/id argument is empty")
	}
	const appVersion = await context.db.mutation.updateAppVersion({
		where: {
			id: args.id
		},
		data: {
			name: args.name	
		}
	},info)
	return appVersion
}

const deleteAppVersion = async (root,args,context,info) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.id) {
		throw new Error("id argument is empty")
	}
	const appVersion = await context.db.mutation.deleteAppVersion({
		where:{
			id: args.id
		}
	},info)
	return appVersion
}

module.exports = {
	appVersions,
	createAppVersion,
	appVersionToApp,
	appVersionToStory,
	editAppVersion,
	deleteAppVersion
}