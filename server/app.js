const graphqlServer = require("graphql-yoga").GraphQLServer;
const resolvers = require("./resolvers/resolvers");
const { prisma } = require("./generated/prisma-client");
const { static } = require("express");
const path = require("path");

const server = new graphqlServer({
	typeDefs: "./schema.graphql", 
	resolvers,
	context: { prisma }
});

server.use('/static', static(path.join(__dirname, 'public')))

server.start(() => console.log("Running on port 4000"));
