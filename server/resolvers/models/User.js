
const getLoggedInUser = async (parent,args,context) => {
	if (!context.user){
		throw new Error("Not logged in");
	}
	return context.user;
}

module.exports = {
	getLoggedInUser
}