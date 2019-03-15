

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

const editLibrary = async (root,args,context) => {
	if (!args.editLibraryInput.id || !args.editLibraryInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const userId = "cjsxdc4kg35h90b3039qediof";
	const createBy = await context.prisma.user({id:userId});
	const library = await context.prisma.updateLibrary({
		where: { id: args.editLibraryInput.id},
		data:{
			name: args.editLibraryInput.name
		}
	})
	return library
}

const deleteLibrary = async (root,args,context,info) => {
	if (!args.deleteLibraryInput.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const userId = "cjsxdc4kg35h90b3039qediof";
	const createBy = await context.prisma.user({id:userId});
	// var library = await context.prisma.library({id: args.deleteLibraryInput.id});
	// if (library.createBy.id !== createBy.id){
	// 	throw new Error("Unauthorized");
	// }
	var library = await context.prisma.deleteLibrary({id:args.deleteLibraryInput.id});
	return library
}

module.exports = {
	createLibrary,
	editLibrary,
	deleteLibrary
}