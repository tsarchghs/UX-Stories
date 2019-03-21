
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

const profile_photo = async (parent,args,context) => {
	const photo = await context.prisma.files({
		where: {
			user: { id: context.user.id }
		}
 	})
 	return photo[0];
}

module.exports = {
	libraries,
	getLoggedInUser,
	profile_photo
}