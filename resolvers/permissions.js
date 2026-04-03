module.exports = {
	loginPermission: (context, role) => {
		if (!context.user) {
			context.res.status(401);
			throw new Error("You must be logged in");
		}
		if (role === "ADMIN" && context.user.role === "MEMBER") {
			throw new Error("Unauthorized");
		}
	},
	libraryPermission: async (context, libraryId) => {
		const libraries = await context.db.library.findMany({
			where: {
				id: libraryId,
				createdById: context.user.id
			}
		});
		if (!libraries.length) {
			throw new Error(`Node with id ${libraryId} doesn't exist or unauthorized`);
		}
	},
	storyToLibraryPermission: async (context, libraryId) => {
		const libraries = await context.db.library.findMany({
			where: {
				id: libraryId,
				createdById: context.user.id
			}
		});
		if (!libraries.length) {
			throw new Error(`Node with id ${libraryId} doesn't exist or unauthorized`);
		}
	}
};
