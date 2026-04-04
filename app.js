require('dotenv').config()
const { GraphQLServer, PubSub } = require("graphql-yoga");
const resolvers = require("./resolvers/resolvers");
const { static } = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { formatError } = require("apollo-errors");
const fs = require("fs");
const prismaDb = require("./prismaDb");
const cors = require("cors");
const Sentry = require("./sentryClient");
const middlewares = require("./middlewares/index")
var https = require('https');
// soft algolia sync script
// require("./algolia/init")();

if (!fs.existsSync("./public/file")){
	fs.mkdirSync("./public/file");
}

let pubsub = new PubSub();
const server = new GraphQLServer({
	endpoint: "/graphql",
	typeDefs: "./schema.graphql", 
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
server.express.use('/static', static(path.join(__dirname, 'public')))
if (process.env.PRODUCTION){
	server.express.use(static(path.join(__dirname, './client/build')));

	server.express.get('/*', async (req, res) => {
		// let filePath = path.resolve(__dirname, 'client/build', 'index.html');
		res.sendFile(path.join(__dirname, './client/build', 'index.html'));
	});
}

server.express.use(bodyParser.urlencoded({limit:"1000mb",extended:true}))
server.express.use(bodyParser.json({limit:"1000mb"}))

server.express.use(Sentry.Handlers.errorHandler());

var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');


const options = {
  port: process.env.PORT || 4000,
  host: "0.0.0.0",
  formatError,
};

server.start(options, () => {
  console.log("Running on port process.env.PORT || 4000");
});

