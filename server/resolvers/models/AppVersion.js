

const createAppVersion = async (root,args,context) => {
	if (!args.appVersionInput.version) {
		throw new Error("appCategoryInput.version argument is empty")
	}
	const appVersion = await context.prisma.createAppVersion({
		version: args.appVersionInput.version,
		order: args.appVersionInput.order,
	})
	return appVersion
}

module.exports = {
	createAppVersion
}