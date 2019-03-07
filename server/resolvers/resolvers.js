const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createToken = (userId) => {
	const token = jwt.sign({
		userId: userId
	},"secret_key");
	return token
}

module.exports = {
	Query: {
		login: async (root,args,context) => {
			if (!args.email || !args.password){
				throw new Error("Either email or password is missing/empty");
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
	},
	Mutation: {
		signUp: async (root,args,context) => {
			console.log(args);
			if (!args.email || !args.name || !args.password){
				throw new Error("Either email,name or password is missing/empty");
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
		},
		createAppCategory: async (root,args,context) => {
			if (!args.name) {
				throw new Error("name argument is missing/empty")
			}
			const exists = await context.prisma.appCategories({where:{name:args.name}});
			if (exists.length){
				throw new Error("Category already exists (use different name)");
			}
			const appCategory = await context.prisma.createAppCategory({
				name: args.name
			})
			return appCategory
		}
	}
}