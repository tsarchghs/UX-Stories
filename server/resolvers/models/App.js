
const createApp = async (root,args,context) => {
	if (!args.appInput.name || !args.appInput.description || !args.appInput.platform || !args.appInput.logo
		|| !args.appInput.file || !args.appInput.version || !args.appInput.category) {
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
}

module.exports = {
	createApp
}