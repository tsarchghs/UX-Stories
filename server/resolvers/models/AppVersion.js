

const createAppVersion = async (root,args,context) => {
	if (!args.appVersionInput.version) {
		throw new Error("version/id argument is empty")
	}
	const appVersion = await context.prisma.createAppVersion({
		version: args.appVersionInput.version,
	})
	return appVersion
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
module.exports = {
	createAppVersion,
	editAppVersion
}