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
		if (e.message.indexOf("unique") !== -1){
			file = await context.db.query.file({where:{url:file_data.url}})
		} else {
			console.log(e)
		}
	}
	return file
} 


const loginWithGoogle = async (root,args,context) => {
	let res = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${args.google_accessToken}&scope=openid%20profile%20email`)
	let data = await res.json()
	console.log(data)
	let users = await context.db.query.users({ where: { oauth_id: data.id }})
	let user = users[0];
	if (!user){
		let res = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${args.google_accessToken}&scope=openid%20profile%20email`)
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
			email,
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
			google_accessToken: args.google_accessToken,
			oauth_id: data.id,
			job: { connect: { id: process.env.DEFAULT_JOB_ID } }
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
		if (user.facebook_accessToken) errors = ["Already signed up with Facebook,Please sign in using Facebook."]
		else errors = ["Account not connected with Google, use email/password."]
		let ERROR = CreateValidationError(errors);
		throw new ERROR;
	}
}

const loginWithFacebook = async (root, args, context) => {
	let res = await fetch(`https://graph.facebook.com/me?access_token=${args.facebook_accessToken}&fields=name%2Cemail%2Cpicture`)
	let data = await res.json()
	let users = await context.db.query.users({ where: { oauth_id: data.id } })
	let user = users[0];
	console.log(user,555)
	if (!user) {
		let res = await fetch(`https://graph.facebook.com/me?access_token=${args.facebook_accessToken}&fields=name%2Cemail%2Cpicture`)
		let data = await res.json()
		console.log(data)
		let email = data.email
		let file;
		if (data.profile){
			let file_data = {
				filename: "undefined",
				mimetype: "undefined",
				encoding: "undefined",
				url: data.profile.data.url
			}
			file = await connectIfUrlExists(context, file_data);
		}
		let userParams = {
			email: email,
			full_name: data.name,
			password: uuid(),
			role: "MEMBER",
			libraries: {
				create: {
					name: "First Library",
					custom_updatedAt: new Date()
				}
			},
			facebook_accessToken: args.facebook_accessToken,
			oauth_id: data.id,
			job: { connect: { id: process.env.DEFAULT_JOB_ID } }
		}
		if (file ) userParams["profile_photo"] = { connect: { id: file.id }}
		user = await context.db.mutation.createUser({ data: userParams });
	}
	if (user.facebook_accessToken) {
		return {
			userId: user.id,
			token: createToken(user.id),
			expiresIn: 1
		}
	} else {
		if (user.google_accessToken) errors = ["Already signed up with Google,Please sign in using Google."]
		else errors = ["Account not connected with Facebook, use email/password."]
		let ERROR = CreateValidationError(errors);
		throw new ERROR;
	}
}


const getAccessTokenInfo = async (args,token) => {
	let url;
	if (args.google_accessToken) url = `https://www.googleapis.com/plus/v1/people/me?access_token=${token}`
	else url = `https://graph.facebook.com/me?access_token=${token}`
	let res = await fetch(url);
	let data = await res.json();
	console.log(data,5111)
	return data
}

const signUp = async (root,args,context) => {
	let usedOAUTH = args.google_accessToken || args.facebook_accessToken;
	if (usedOAUTH) {
		if (args.google_accessToken) {
			return await loginWithGoogle(undefined, { google_accessToken: args.google_accessToken },context)
		} else {
			return await loginWithFacebook(undefined, { facebook_accessToken: args.facebook_accessToken }, context);
		}
	}

	let errors = await checkValidation(signUpSchema, args, false);
	if (errors.length) {
		let ERROR = CreateValidationError(errors);
		throw new ERROR;
	}
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
		oauth_id:uuid(),
		job: { connect: { id: process.env.DEFAULT_JOB_ID }}
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
	try {
		user = await context.db.mutation.createUser({ data:userParams });
	} catch (e) {
		console.log(e.message, 9919492234)
		if (e.message === "A unique constraint would be violated on User. Details: Field name = email") {
			let ERROR = CreateValidationError(["Email is already taken."])
			throw new ERROR;
		}
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
	loginWithFacebook,
	signUp,
	forgetPassword,
	verifyForgotPassword,
	resetPassword
}