const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { prisma } = require("../generated/prisma-client");
const configs = require("../configs");

module.exports = (passport) => {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = configs.jwt_secret

	passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
		const user = await prisma({where:{device_id: jwt_payload.userId}})
		if (user && user.role === "ADMIN") {
			return done(null, user)
		}
		return done(null, false)
	}))
}