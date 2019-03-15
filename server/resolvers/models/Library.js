

const createLibrary = async (root,args,context) => {
	if (!args.createLibraryInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const userId = "cjsxdc4kg35h90b3039qediof";
	const createBy = await context.prisma.user({id:userId});
	const library = await context.prisma.createLibrary({
		createBy: {
			connect: { id: createBy.id }
		},
		name: args.createLibraryInput.name
	})
	library.createBy = createBy;
	library.stories = [];
	return library
}

module.exports = {
	createLibrary
}