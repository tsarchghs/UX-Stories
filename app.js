const graphqlServer = require("graphql-yoga").GraphQLServer;
const resolvers = require("./resolvers/resolvers");
const prismaTypeDefs = require("./generated/prisma-client/prisma-schema.js").typeDefs;
const { Prisma } = require("prisma-binding");
const { static } = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dashboard_route = require("./routes/admin/dashboard");
const auth_route = require("./routes/admin/auth");
const expressStatic = require("express").static;
const configs = require("./configs");

const prismaDb = new Prisma({
	typeDefs:prismaTypeDefs,
	endpoint:"https://eu1.prisma.sh/gjergj-kadriu-c6f550/stories/dev",
	debug: false
})

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



server.start(() => console.log("Running on port 4000"));
