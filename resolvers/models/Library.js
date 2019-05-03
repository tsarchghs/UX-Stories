const permissions = require("../permissions");
const { checkValidation } = require("../../helpers.js");
const { librariesSchema, 
		librarySchema, 
		createLibrarySchema, 
		editLibrarySchema 
} = require("../../validations/libraryValidations.js");

const library = async (root,args,context,info) => {
	await checkValidation(librarySchema,args);
	const createBy = context.user;
	const library = await context.db.query.libraries({
		where:{
			id: args.id,
			createdBy: {
				id: createBy.id
			}
		}
	},info)
	return library[0];
}

const libraries = async (root,args,context,info) => {
	await checkValidation(librariesSchema,args);
	permissions.loginPermission(context,"MEMBER")
	const createBy = context.user
	const filterBy = {
		where:{
			createdBy: {
				id: createBy.id
			},
			stories_every:{}
		}
	} 
	if (args.libraryFilterInput){
		if (args.libraryFilterInput.containsStory){
			filterBy["where"]["stories_some"] = { id: args.libraryFilterInput.containsStory }
		}
		if (args.libraryFilterInput.storyCategories && args.libraryFilterInput.storyCategories.length){
			filterBy["where"]["stories_every"] = {
				AND: args.libraryFilterInput.storyCategories.map(storyCategory=> (
						{
							storyCategories_some:{
								name:storyCategory
							}
						}
					))
			}
		}
		if (args.libraryFilterInput.storyElements && args.libraryFilterInput.storyElements.length) {
			if (filterBy["where"]["stories_every"]["AND"] === undefined){
				filterBy["where"]["stories_every"]["AND"] = []
			}
			filterBy["where"]["stories_every"]["AND"] = filterBy["where"]["stories_every"]["AND"].concat(
					args.libraryFilterInput.storyElements.map(storyElement => (
							{
								storyElements_some: {
									name: storyElement
								}
							}
						))
				)
		}
	}
	const libraries = await context.db.query.libraries(filterBy,info);
	return libraries;
}

const createLibrary = async (root,args,context,info) => {
	await checkValidation(createLibrarySchema,args);
	permissions.loginPermission(context,"MEMBER")
	const createBy = context.user
	const library = await context.db.mutation.createLibrary({
		data:{
			createdBy: {
				connect: { id: createBy.id }
			},
			name: args.name
		}
	},info)
	return library
}
const editLibrary = async (root,args,context,info) => {
	console.log(args);
	await checkValidation(editLibrarySchema,args);
	permissions.loginPermission(context,"MEMBER")
	await permissions.libraryPermission(context,args.id)

	let data = {}
	if (args.name) data["name"] = args.name
	let links = []
	if (args.stories){
		args.stories.map(story => {
			if (links[story.type] === undefined) links[story.type] = []
			links[story.type].push({id:story.story});
		})
		console.log(links);
		data["stories"] = links
	}

	const library = await context.db.mutation.updateLibrary({
		where: { id: args.id},
		data:data
	},info)
	return library
}


module.exports = {
	library,
	libraries,
	createLibrary,
	editLibrary
}