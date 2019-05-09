const prismaTypeDefs = require("./generated/prisma-client/prisma-schema.js").typeDefs;
const { Prisma } = require("prisma-binding");

const prismaDb = new Prisma({
	typeDefs:prismaTypeDefs,
	endpoint:"https://eu1.prisma.sh/gjergj-kadriu-c6f550/stories/dev",
	debug: false
})

module.exports = prismaDb