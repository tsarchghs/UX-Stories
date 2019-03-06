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
	}
}