const permissions = require("../permissions");

const library = async (root,args,context) => {
	if (!args.libraryInput){
		throw new Error("args.libraryInput required");
	}
	permissions.loginPermission(context,"MEMBER");
	const createBy = context.user;
	const library = await context.prisma.libraries({
		where:{
			id: args.libraryInput.id,
			createBy: {
				id: createBy.id
			}
		}
	})
	return library[0];
}

const libraries = async (root,args,context) => {
	permissions.loginPermission(context,"MEMBER")
	const createBy = context.user

	if (args.libraryFilterInput && 
		!(
			(
				args.libraryFilterInput.categories &&
				args.libraryFilterInput.categories.length
			)
			 ||
			(
				args.libraryFilterInput.elements &&
				args.libraryFilterInput.elements.length
			)
		)
	){
		throw new Error("You must specifiy either one of category/storyCategory or elements arguments passing libraryFilterInput argument");
	}
	const filterBy = {
		where:{
			createBy: {
				id: createBy.id
			}
		}
	} 
	if (args.libraryFilterInput && args.libraryFilterInput.categories && args.libraryFilterInput.categories.length){
		filterBy["where"]["stories_every"] = {
			AND: args.libraryFilterInput.categories.map(storyCategory=> (
					{
						categories_some:{
							name:storyCategory
						}
					}
				))
		}
	}
	if (args.libraryFilterInput && args.libraryFilterInput.elements && args.libraryFilterInput.elements.length) {
		if (filterBy["where"]["stories_every"]["AND"] === undefined){
			filterBy["where"]["stories_every"]["AND"] = []
		}
		filterBy["where"]["stories_every"]["AND"] = filterBy["where"]["stories_every"]["AND"].concat(
				args.libraryFilterInput.elements.map(storyElement => (
						{
							elements_some: {
								name: storyElement
							}
						}
					))
			)
	}
	const libraries = await context.prisma.libraries(filterBy)
	return libraries;
}

const createLibrary = async (root,args,context) => {
	permissions.loginPermission(context,"MEMBER")
	if (!args.createLibraryInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const createBy = context.user
	const library = await context.prisma.createLibrary({
		createBy: {
			connect: { id: createBy.id }
		},
		name: args.createLibraryInput.name
	})
	return library
}

const editLibrary = async (root,args,context) => {
	permissions.loginPermission(context,"MEMBER")
	if (!args.editLibraryInput.id || !args.editLibraryInput.name) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	await permissions.libraryPermission(context,args.editLibraryInput.id)
	const library = await context.prisma.updateLibrary({
		where: { id: args.editLibraryInput.id},
		data:{
			name: args.editLibraryInput.name
		}
	})
	return library
}

const deleteLibrary = async (root,args,context) => {
	permissions.loginPermission(context,"MEMBER")
	if (!args.deleteLibraryInput.id) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	await permissions.libraryPermission(context,args.deleteLibraryInput.id)
	var library = await context.prisma.deleteLibrary({id:args.deleteLibraryInput.id});
	return library
}

const createBy = async (parent,args,context) => {
	const user = await context.prisma.users({
		where:{
			libraries_some:{
				id: parent.id
			}
		}
	})
	user[0].password = null;
	return user[0]
}

const stories = async (parent,args,context) => {
	const stories = await context.prisma.stories({
		where:{
			libraries_some: {
				id: parent.id
			}
		}
	})
	return stories
}

module.exports = {
	library,
	libraries,
	createLibrary,
	editLibrary,
	deleteLibrary,
	createBy,
	stories
}