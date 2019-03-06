const graphqlServer = require("graphql-yoga").GraphQLServer;
const resolvers = require("./resolvers/resolvers");
const { prisma } = require("./generated/prisma-client");

const server = new graphqlServer({
	typeDefs: "./schema.graphql", 
	resolvers,
	context: { prisma }
});

server.start(() => console.log("Running on port 4000"));
