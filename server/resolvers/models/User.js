

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
	libraries
}