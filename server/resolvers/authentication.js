const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configs = require("../configs");
const fileHandling = require("../modules/fileApi");

const saltRounds = 10;

const createToken = (userId) => {
	const token = jwt.sign({
		userId: userId
	},configs.jwt_secret);
	return token
}

const login = async (root,args,context) => {
	if (!args.email || !args.password){
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const user = await context.prisma.user({email:args.email});
	if (!user){
		throw new Error("Invalid credentials");
	}
	const validPassword = await bcrypt.compare(args.password,user.password);
	if (!validPassword){
		throw new Error("Invalid credentials");	
	}
	return {
		userId: user.id,
		token: createToken(user.id),
		expiresIn: 1
	};
}

const signUp = async (root,args,context) => {
	var hasLogo; 
	var profile_photo;
	if (!args.email || !args.first_name || !args.last_name || !args.password){
		throw new Error("Please check that all of your arguments are not empty!")
	}
	if (args.profile_photo && !(args.profile_photo.base64 && args.profile_photo.mimetype)) {
		throw new Error("profile_photo.base64 or profile_photo.mimetype is missing");
	} else {
		hasLogo = args.profile_photo ? true : false
	}
	if (hasLogo){
		profile_photo = await fileHandling.processUpload(args.profile_photo.base64,
															   args.profile_photo.mimetype,
															   context);
		console.log(profile_photo);
	}
	const hashed_password = await bcrypt.hash(args.password,saltRounds);
	var userParams = {
		email: args.email,
		first_name: args.first_name,
		last_name: args.last_name,
		password: hashed_password,
		role: "MEMBER"
	}
	if (profile_photo){
		userParams["profile_photo"] = {
			connect: { id: profile_photo.id }
		}
	}
	const user = await context.prisma.createUser(userParams);
	return {
		userId: user.id,
		token: createToken(user.id),
		expiresIn: 1
	};
}

module.exports = {
	login,
	signUp
}