
const getLoggedInUser = async (parent,args,context) => {
	if (!context.user){
		throw new Error("Not logged in");
	}
	return context.user;
}

const libraries = async (parent,args,context) => {
	const libraries = await context.prisma.libraries({
		where:{
			createBy:{
				id: parent.id
			}
		}
	})
	return libraries;
}

module.exports = {
	libraries,
	getLoggedInUser
}