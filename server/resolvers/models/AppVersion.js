

const createAppVersion = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.appVersionInput.version) {
		throw new Error("version argument is empty")
	}
	const appVersion = await context.prisma.createAppVersion({
		version: args.appVersionInput.version,
	})
	return appVersion
}

const appVersionToApp = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.appVersionToAppInput.appVersion || !args.appVersionToAppInput.app) {
		throw new Error("appVersion and/or app argument is empty")
	}
	const app = await context.prisma.updateApp({
		where: {id:args.appVersionToAppInput.app},
		data: {
			versions: {
				[args.appVersionToAppInput.type]: { id: args.appVersionToAppInput.appVersion }
			}
		}
	})
	return app

}
const appVersionToStory = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.appVersionToStoryInput.appVersion || !args.appVersionToStoryInput.story) {
		throw new Error("appVersion and/or story argument is empty")
	}
	const story = await context.prisma.updateStory({
		where: {id:args.appVersionToStoryInput.story},
		data: {
			versions: {
				[args.appVersionToStoryInput.type]: { id: args.appVersionToStoryInput.appVersion }
			}
		}
	})
	return story
}

const editAppVersion = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.editAppVersionInput.version || !args.editAppVersionInput.id) {
		throw new Error("version/id argument is empty")
	}
	const appVersion = await context.prisma.updateAppVersion({
		where: {
			id: args.editAppVersionInput.id
		},
		data: {
			version: args.editAppVersionInput.version	
		}
	})
	return appVersion
}

const deleteAppVersion = async (root,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	if (!args.deleteAppVersionInput.id) {
		throw new Error("id argument is empty")
	}
	const appVersion = await context.prisma.deleteAppVersion({
		id: args.deleteAppVersionInput.id
	})
	return appVersion
}

module.exports = {
	createAppVersion,
	editAppVersion,
	deleteAppVersion,
	appVersionToApp,
	appVersionToStory
}