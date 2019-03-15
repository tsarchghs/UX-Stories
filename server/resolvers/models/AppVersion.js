

const createAppVersion = async (root,args,context) => {
	if (!args.appVersionInput.version) {
		throw new Error("version argument is empty")
	}
	const appVersion = await context.prisma.createAppVersion({
		version: args.appVersionInput.version,
	})
	return appVersion
}

const linkAppVersionToApp = async (root,args,context) => {
	if (!args.linkAppVersionToAppInput.appVersion || !args.linkAppVersionToAppInput.app) {
		throw new Error("appVersion and/or app argument is empty")
	}
	const app = await context.prisma.updateApp({
		where: {id:args.linkAppVersionToAppInput.app},
		data: {
			versions: {
				connect: { id: args.linkAppVersionToAppInput.appVersion }
			}
		}
	})
	return app
}

const editAppVersion = async (root,args,context) => {
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
	linkAppVersionToApp
}