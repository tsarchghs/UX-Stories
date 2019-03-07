const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createToken = (userId) => {
	const token = jwt.sign({
		userId: userId
	},"secret_key");
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
	console.log(args);
	if (!args.email || !args.name || !args.password){
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const hashed_password = await bcrypt.hash(args.password,saltRounds);
	const user = await context.prisma.createUser({
		email: args.email,
		name: args.name,
		password: hashed_password,
		role: "MEMBER"
	});
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