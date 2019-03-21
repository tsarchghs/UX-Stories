const graphqlServer = require("graphql-yoga").GraphQLServer;
const resolvers = require("./resolvers/resolvers");
const { prisma } = require("./generated/prisma-client");
const { static } = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const dashboard_route = require("./routes/admin/dashboard");
const auth_route = require("./routes/admin/auth");
const expressStatic = require("express").static;
const configs = require("./configs");
const passport = require("passport");
require("./strategies/jwtStrategy")(passport);

const server = new graphqlServer({
	typeDefs: "./schema.graphql", 
	resolvers,
	context: async req => {
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
				user = await prisma.user({id:decoded.userId});
				loggedIn = true;
			}
		}
		user.password = null;
		return {
			prisma,
			user,
			loggedIn
		}
	}
});

server.express.set("view engine","ejs");
server.express.use(passport.initialize());
server.express.use(passport.session());
server.express.use(bodyParser.urlencoded({limit:"1000mb",extended:true}))
server.express.use(bodyParser.json({limit:"1000mb"}))

server.express.use("/admin/dashboard",dashboard_route(passport));
server.express.use("/admin/auth",auth_route);

server.use('/static', static(path.join(__dirname, 'public')))

server.start(() => console.log("Running on port 4000"));
