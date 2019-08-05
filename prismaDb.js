const prismaTypeDefs = require("./generated/prisma-client/prisma-schema.js").typeDefs;
const { Prisma } = require("prisma-binding");

const prismaDb = new Prisma({
	typeDefs:prismaTypeDefs,
	endpoint:"http://localhost:4466/",
	debug: false
})
console.log(prismaDb.mutation.executeRaw)

module.exports = prismaDb