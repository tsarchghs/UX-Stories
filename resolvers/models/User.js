const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const countUsers = async (parent,args,context) => {
	let data = await context.db.query.usersConnection({},`
			{
				aggregate { count }
			}
		`)
	return data.aggregate.count;
}

const users = async (parent,args,context,info) => {
	// permissions.loginPermission(context,"ADMIN");
	let filterBy = {}
	if (args.userFilterInput){
		if (args.userFilterInput.full_name_contains){
			filterBy["where"] = {full_name_contains:args.userFilterInput.full_name_contains}
		}
		if (args.userFilterInput.first) filterBy["first"] = args.userFilterInput.first
		if (args.userFilterInput.first) filterBy["skip"] = args.userFilterInput.skip
	}
	let data = await context.db.query.users(filterBy,info)
	return data;
}

const editProfile = async (parent,args,context,info) => {
	permissions.loginPermission(context,"MEMBER");
	console.log(args);
	if (
		!args.full_name &&
		!args.job &&
		!args.email &&
		!args.password &&
		!(args.profile_photo && args.profile_photo.base64 && args.profile_photo.mimetype)
	) {
		throw new Error("At least one argument must be specified");
	}
	let data = {}
	if (args.full_name) data["full_name"] = args.full_name;
	if (args.email) data["email"] = args.email
	if (args.job) data["job"] = {connect:{id:args.job}}
		
	if (args.password) {
		data["password"] = await bcrypt.hash(args.password,saltRounds);
	}
	if (args.profile_photo && args.profile_photo.base64 && args.profile_photo.mimetype){
		const profile_image = await fileHandling.processUpload(args.profile_photo.base64,
															args.profile_photo.mimetype,
															context);
		data["profile_photo"] = {connect:{id:profile_image.id}};
	}
	return await context.db.mutation.updateUser({data,where:{id:context.user.id}},info);
}

const getLoggedInUser = async (parent,args,context,info) => {
	if (!context.user){
		return undefined;
	}
	return await context.db.query.user({
		where:{id:context.user.id}
	},info);
}

module.exports = {
	users,
	getLoggedInUser,
	editProfile,
	countUsers
}