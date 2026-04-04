require('dotenv').config()
const { GraphQLServer, PubSub } = require("graphql-yoga");
const resolvers = require("./resolvers/resolvers");
const { static } = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { formatError } = require("apollo-errors");
const prismaDb = require("./prismaDb");
const cors = require("cors");
const Sentry = require("./sentryClient");
const middlewares = require("./middlewares/index")
// soft algolia sync script
// require("./algolia/init")();

const isVercel = Boolean(process.env.VERCEL);
const shouldServeClient = isVercel || process.env.PRODUCTION || process.env.NODE_ENV === "production";
const graphqlEndpoint = "/api/graphql";
const publicPath = path.join(__dirname, "public");
const publicIndexPath = path.join(publicPath, "index.html");
const schemaPath = path.join(__dirname, "schema.graphql");
const typeDefs = fs.readFileSync(schemaPath, "utf8");

let pubsub = new PubSub();
const server = new GraphQLServer({
	typeDefs,
	resolvers,
	middlewares,
	context: async (data) => {
		var user = undefined
		var loggedIn = false;
		if (data.request && data.request.headers["authorization"]){
			const token = data.request.headers["authorization"].split(" ")[1];
			const decoded = await jwt.verify(token,process.env.jwt_secret,(err,decoded) => {
				if (err) {
					if (err.name === "JsonWebTokenError") {
						return false
					}
					return new Error("Invalid token");
				}
				return decoded
			});
			if (decoded){
				user = await prismaDb.user.findUnique({ where: { id: decoded.userId } })
				loggedIn = true;
			}
		}
		if (user) user.password = null;
		return {
			res: data.response,
			req: data.request,
			user: user,
			loggedIn,
			db: prismaDb,
			pubsub
		}
	}
});

server.express.use(cors())


server.express.use(Sentry.Handlers.requestHandler());


// the __dirname is the current directory from where the script is running
server.express.use('/static', static(publicPath))
server.express.use(static(publicPath));
if (shouldServeClient){

	server.express.get(/^\/(?!api(?:\/|$)).*/, async (req, res) => {
		res.sendFile(publicIndexPath);
	});
}

server.express.use(bodyParser.urlencoded({limit:"1000mb",extended:true}))
server.express.use(bodyParser.json({limit:"1000mb"}))
  
server.express.use(Sentry.Handlers.errorHandler());

const options = {
  endpoint: graphqlEndpoint,
  subscriptions: isVercel ? false : graphqlEndpoint,
  playground: isVercel ? false : graphqlEndpoint,
  port: process.env.PORT || 4000,
  host: "0.0.0.0",
  formatError,
};

const httpServer = server.createHttpServer(options);

if (!isVercel && require.main === module) {
  httpServer.listen(options.port, options.host, () => {
    console.log(`Running on ${options.host}:${options.port}`);
  });
}

module.exports = server.express;
module.exports.graphqlServer = server;
module.exports.httpServer = httpServer;
