const router = require("express").Router();

module.exports = (passport) => {
	router.get("/",passport.authenticate('jwt'),(req,res) => {
		return res.render("dashboard");
	})
	return router
}