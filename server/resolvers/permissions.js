

module.exports = {
	loginPermission: (context,role) => {
		if (!context.loggedIn) {
			throw new Error("You must be logged in");
		}
		if (role === "ADMIN" && (context.user.role === "MEMBER") ) {
			throw new Error("Unauthorized");
		}
	}
}