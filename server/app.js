const graphqlServer = require("graphql-yoga").GraphQLServer;
const resolvers = require("./resolvers/resolvers");
const { prisma } = require("./generated/prisma-client");
const { static } = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const server = new graphqlServer({
	typeDefs: "./schema.graphql", 
	resolvers,
	context: async req => {
		var user = undefined
		var loggedIn = false
		if (req.request.headers["authorization"]){
			const token = req.request.headers["authorization"].split(" ")[1];
			const decoded = await jwt.verify(token,"secret_key",(err,decoded) => {
				if (err) {
					if (err.name === "JsonWebTokenError") {
						return false
					}
					return new Error("Invalid token");
				}
				return decoded
			});
			if (decoded){
				user = await prisma.user({id:decoded.userId});
				loggedIn = true;
			}
		}
		return {
			prisma,
			user,
			loggedIn
		}
	}
});

server.express.use(bodyParser.urlencoded({limit:"1000mb",extended:true}))
server.express.use(bodyParser.json({limit:"1000mb"}))

server.use('/static', static(path.join(__dirname, 'public')))

server.start(() => console.log("Running on port 4000"));
