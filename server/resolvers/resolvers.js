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
				throw new Error("Either email or password is empty");
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
				throw new Error("Either email,name or password is empty");
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
			if (!args.appCategoryInput.name) {
				throw new Error("appCategoryInput.name argument is empty")
			}
			const exists = await context.prisma.appCategories({where:{name:args.appCategoryInput.name}});
			if (exists.length){
				throw new Error("Category already exists (use different name)");
			}
			const appCategory = await context.prisma.createAppCategory({
				name: args.appCategoryInput.name
			})
			return appCategory
		},
		createAppVersion: async (root,args,context) => {
			if (!args.appVersionInput.version) {
				throw new Error("appCategoryInput.version argument is empty")
			}
			const appVersion = await context.prisma.createAppVersion({
				version: args.appVersionInput.version,
				order: args.appVersionInput.order,
			})
			return appVersion
		}
	}
}