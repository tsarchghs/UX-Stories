const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configs = require("../configs");
const fileHandling = require("../modules/fileApi");
const nodemailer = require("nodemailer");
const mailgun = require('mailgun-js')(configs.mailgun);
const { checkValidation, CreateValidationError } = require("../helpers.js");
const { loginSchema, signUpSchema } = require("../validations/authValidations.js");

const saltRounds = 10;

const createToken = (userId) => {
	const token = jwt.sign({
		userId: userId
	},configs.jwt_secret);
	return token
}

const login = async (root,args,context) => {
	await checkValidation(loginSchema, args,false,"Invalid credentials");
	const user = await context.db.query.user({where:{email:args.email}});
	if (!user){
		throw new Error("Invalid credentials");
	}
	const validPassword = await bcrypt.compare(args.password,user.password);
	if (!validPassword){
		throw new Error("Invalid credentials");	
	}
	return {
		userId: user.id,
		token: createToken(user.id),
		expiresIn: 1
	};
}

const signUp = async (root,args,context) => {
	var errors = await checkValidation(signUpSchema, args, false);
	var hasLogo; 
	var profile_photo;
	hasLogo = args.profile_photo ? true : false
	if (hasLogo){
		profile_photo = await fileHandling.processUpload(args.profile_photo.base64,
														args.profile_photo.mimetype,context);
	}
	const hashed_password = await bcrypt.hash(args.password,saltRounds);
	var userParams = {
		email: args.email,
		full_name: args.full_name,
		password: hashed_password,
		role: "MEMBER",
		job: {
			connect:{id:args.job}
		},
		libraries: {
			create: {
				name: "First Library"
			}
		}
	}
	if (profile_photo){
		userParams["profile_photo"] = {
			connect: { id: profile_photo.id }
		}
	}
	console.log(errors,123);
	if (!errors.length){
		try {
			var user = await context.db.mutation.createUser({data:userParams});
		} catch (e) {
			if (e.message === "A unique constraint would be violated on User. Details: Field name = email"){
				var errors = ["Email is already taken."]
			}
		}
	} else {
		const user = await context.db.query.user({where:{email:args.email}});
		if (user){
			errors.push("Email is already taken.");
		}
	}
	console.log(errors);
	if (errors.length){
		let ERROR = CreateValidationError(errors);
		throw new ERROR;
	}
	return {
		userId: user.id,
		token: createToken(user.id),
		expiresIn: 1
	};
}
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: 'gjergjk71@gmail.com',
        pass:'gjergji.123'
    }
});

const forgetPassword = async (root,args,context) => {
	if (!args.email){
		throw new Error("email arg can't be empty");
	}
	let user = await context.db.query.user({where:{email:args.email}});
	if (!user){
		return {
			success: false,
			error: `No user found with email ${args.email}`
		}
	}
	const token = jwt.sign({
		forgotPassword: user.id
	},configs.jwt_forgotPassword_secret);
	var data = {
	  from: 'Mailgun Sandbox <postmaster@sandbox7c10cba56e9a4f0f9b23c09194475167.mailgun.org>',
	  to: `${user.full_name} <${user.email}>`,
	  subject: `UX-Stories: Forgot password`,
	  text: `Here it is ${`${configs.URI}/reset/${token}`}!`
	};
	console.log(data);
	mailgun.messages().send(data,(err,body) => {
		console.log(err,body);
	});
	return {success:true}
}

const verifyForgotPassword = async (root,args,context) => {
	if (!args.token){
		throw new Error("Token can't be empty");
	}
	return await jwt.verify(args.token,configs.jwt_forgotPassword_secret,(err,decoded) => {
		return {valid:!err}
	})
}

const resetPassword = async (root,args,context) => {
	if (!args.token || !args.new_password || !args.repeat_new_password){
		throw new Error("token,new_password or repeat_new_password can't be empty");
	}
	if (!(args.new_password === args.repeat_new_password)){
		return {
			success:false,
			error: "Password do not match"
		}
	}
	const decoded = await jwt.verify(args.token,configs.jwt_forgotPassword_secret,(err,decoded) => {
		if (err) return new Error("Invalid token");
		return decoded
	});
	console.log(decoded);
	if (decoded.message){
		return {
			success: false,
			error: decoded.message
		};
	}
	try {
		const user = await context.db.mutation.updateUser({
			data:{
				password: await bcrypt.hash(args.new_password,saltRounds)
			},
			where:{id:decoded.forgotPassword}
		});
	} catch (error){
		return {success:false,error}
	}
	return {success:true}

}

module.exports = {
	login,
	signUp,
	forgetPassword,
	verifyForgotPassword,
	resetPassword
}