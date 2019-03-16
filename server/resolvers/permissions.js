

module.exports = {
	loginPermission: (context,role) => {
		if (!context.loggedIn) {
			throw new Error("You must be logged in");
		}
		if (role === "ADMIN" && (context.user.role === "MEMBER") ) {
			throw new Error("Unauthorized");
		}
	},
	libraryPermission: async (context,libraryId) => {
		const libraries = await context.prisma.libraries({
			where: {
				id: libraryId,
				createBy: {
					id: context.user.id
				}
			}
		})
		if (!libraries.length) {
			throw new Error(`Node with id ${libraryId} doesn't exist or unauthorized`);
		}
	}
}