const graphqlServer = require("graphql-yoga").GraphQLServer;
const resolvers = require("./resolvers/resolvers");
const { static } = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const configs = require("./configs");
const { formatError } = require("apollo-errors");
const fs = require("fs");
const prismaDb = require("./prismaDb");

require("./algolia/init")();

if (!fs.existsSync("./public/file")){
	fs.mkdirSync("./public/file");
}

const server = new graphqlServer({
	endpoint: "/graphql",
	typeDefs: "./schema.graphql", 
	resolvers,
	context: async (req) => {
		var user = undefined
		var loggedIn = false
		if (req.request.headers["authorization"]){
			const token = req.request.headers["authorization"].split(" ")[1];
			const decoded = await jwt.verify(token,configs.jwt_secret,(err,decoded) => {
				if (err) {
					if (err.name === "JsonWebTokenError") {
						return false
					}
					return new Error("Invalid token");
				}
				return decoded
			});
			if (decoded){
				user = await prismaDb.query.user({where:{id:decoded.userId}})
				loggedIn = true;
			}
		}
		if (user) user.password = null;
		return {
			req,
			user: user,
			loggedIn,
			db: prismaDb
		}
	}
});

// the __dirname is the current directory from where the script is running
server.express.use('/static', static(path.join(__dirname, 'public')))
if (configs.PRODUCTION){
	server.express.use(static(path.join(__dirname, './client/build')));

	server.express.get('/*', function (req, res) {
	  res.sendFile(path.join(__dirname, './client/build', 'index.html'));
	});
}


server.express.set("view engine","ejs");

server.express.use(bodyParser.urlencoded({limit:"1000mb",extended:true}))
server.express.use(bodyParser.json({limit:"1000mb"}))

const options = {
	formatError
};

server.start(options,() => console.log("Running on port 4000"));
