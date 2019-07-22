const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileHandling = require("../modules/fileApi");
const nodemailer = require("nodemailer");
const mailgun = require('mailgun-js')({
	apiKey: process.env.mailgun_apikey,
	DOMAIN: process.env.mailgun_domain
});
const { checkValidation, CreateValidationError } = require("../helpers.js");
const { loginSchema, signUpSchema } = require("../validations/authValidations.js");
const uuid = require("uuid");
const saltRounds = 10;

const createToken = (userId) => {
	const token = jwt.sign({
		userId: userId
	},process.env.jwt_secret);
	return token
}

const throwErrors = errors => {
	let ERROR = CreateValidationError(errors);
	throw new ERROR;
}

const login = async (root,args,context) => {
	await checkValidation(loginSchema, args,false,"Invalid credentials");
	let errors = []
	const user = await context.db.query.user({where:{email:args.email}});
	if (!user){
		errors.push("Invalid credentials")
		throwErrors(errors)
	}
	if (user.google_accessToken){
		errors.push("Please sign-in using google")
		throwErrors(errors)
	}
	const validPassword = await bcrypt.compare(args.password,user.password);
	if (!validPassword && !user.google_accessToken){
		errors.push("Invalid credentials")		
		throwErrors(errors)
	}
	return {
		userId: user.id,
		token: createToken(user.id),
		expiresIn: 1
	};
}
const connectIfUrlExists = async (context,file_data) => {
	let file;
	try {
		file = await context.db.mutation.createFile({ data: file_data })
	} catch (e) {
		console.log(e)
		if (e.message.indexOf("unique") !== -1){
			file = await context.db.query.file({where:{url:file_data.url}})
		}
	}
	return file
} 

const loginWithGoogle = async (root,args,context) => {
	let res = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${args.google_accessToken}`)
	let data = await res.json()
	let email = data.emails[0].value
	let user = await context.db.query.user({where:{email}})
	if (!user){
		let res = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${args.google_accessToken}`)
		let data = await res.json()
		let email = data.emails[0].value
		let file_data = {
			filename: "undefined",
			mimetype: "undefined",
			encoding: "undefined",
			url: data.image.url
		}
		let file = await connectIfUrlExists(context, file_data);
		let userParams = {
			email: email,
			full_name: data.displayName,
			password: uuid(),
			profile_photo: {
				connect: { id: file.id }
			},
			role: "MEMBER",
			libraries: {
				create: {
					name: "First Library",
					custom_updatedAt: new Date()
				}
			},
			google_accessToken: args.google_accessToken
		}
		user = await context.db.mutation.createUser({data: userParams});
	}
	if (user.google_accessToken){
		return {
			userId: user.id,
			token: createToken(user.id),
			expiresIn: 1
		}
	} else {
		errors = ["Account not connected with google, use email/password."]
		let ERROR = CreateValidationError(errors);
		throw new ERROR;
	}
}


const signUp = async (root,args,context) => {
	let errors = await checkValidation(signUpSchema, args, false);
	let profile_photo;
	let withUrl = {
		filename: "undefined", 
		mimetype: "undefined", 
		encoding: "undefined"	
	}
	if (args.profile_photo){
		if (args.profile_photo.createWithBase64){
			let base64 = args.profile_photo.createWithBase64.base64;
			let mimetype = args.profile_photo.createWithBase64.mimetype;
			profile_photo = await fileHandling.processUpload(base64,mimetype,context);
		} else if (args.profile_photo.createWithUrl) {
			withUrl.url = args.profile_photo.createWithUrl.url
			profile_photo = await connectIfUrlExists(context,withUrl)
		}
	} else {
		withUrl.url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"
		profile_photo = await connectIfUrlExists(context,withUrl)
	}
	const hashed_password = args.google_accessToken ? uuid() : await bcrypt.hash(args.password,saltRounds);
	let userParams = {
		email: args.email,
		full_name: args.full_name,
		password: hashed_password,
		role: "MEMBER",
		libraries: {
			create: {
				name: "First Library",
				custom_updatedAt: new Date()
			}
		},
		google_accessToken: args.google_accessToken
	}
	if (args.job){
		userParams["job"] = {
			connect: { id: args.job }
		}
	}
	if (profile_photo){
		userParams["profile_photo"] = {
			connect: { id: profile_photo.id }
		}
	}
	let user;
	if (!errors.length){
		try {
			user = await context.db.mutation.createUser({data:userParams});
		} catch (e) {
			if (e.message === "A unique constraint would be violated on User. Details: Field name = email"){
				errors = ["Email is already taken."]
			}
			if (args.google_accessToken){
				errors = []
				let res = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${args.google_accessToken}`)
				let data = await res.json()
				user = await context.db.query.user({ where: { email: data.emails[0].value } });
			}
		}
	} else {
		user = await context.db.query.user({where:{email:args.email}});
		if (user){
			errors.push("Email is already taken.");
		}
	}
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
	}, process.env.jwt_forgotPassword_secret);
	var data = {
	  from: 'Mailgun Sandbox <postmaster@sandbox7c10cba56e9a4f0f9b23c09194475167.mailgun.org>',
	  to: `${user.full_name} <${user.email}>`,
	  subject: `UX-Stories: Forgot password`,
	  text: `Here it is ${`${process.env.URI}/reset/${token}`}!`
	};
	mailgun.messages().send(data,(err,body) => {
		console.log(err,body);
	});
	return {success:true}
}

const verifyForgotPassword = async (root,args,context) => {
	if (!args.token){
		throw new Error("Token can't be empty");
	}
	return await jwt.verify(args.token, process.env.jwt_forgotPassword_secret,(err,decoded) => {
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
	const decoded = await jwt.verify(args.token, process.env.jwt_forgotPassword_secret,(err,decoded) => {
		if (err) return new Error("Invalid token");
		return decoded
	});
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
	loginWithGoogle,
	signUp,
	forgetPassword,
	verifyForgotPassword,
	resetPassword
}