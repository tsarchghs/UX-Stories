const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fileHandling = require("../modules/fileApi");
const nodemailer = require("nodemailer");
const mailgun = require("mailgun-js")({
	apiKey: process.env.mailgun_apikey,
	DOMAIN: process.env.mailgun_domain
});
const { checkValidation, CreateValidationError } = require("../helpers.js");
const { loginSchema, signUpSchema } = require("../validations/authValidations.js");
const uuid = require("uuid");

const saltRounds = 10;

const createToken = userId => {
	const token = jwt.sign({
		userId
	}, process.env.jwt_secret);
	return token;
};

const throwErrors = errors => {
	const ERROR = CreateValidationError(errors);
	throw new ERROR();
};

const connectIfUrlExists = async (context, file_data) => {
	try {
		return await context.db.file.create({ data: file_data });
	} catch (error) {
		if (error.code === "P2002") {
			return context.db.file.findUnique({
				where: { url: file_data.url }
			});
		}
		throw error;
	}
};

const login = async (root, args, context) => {
	await checkValidation(loginSchema, args, false, "Invalid credentials");
	const user = await context.db.user.findUnique({
		where: { email: args.email }
	});
	if (!user) {
		throwErrors(["Invalid credentials"]);
	}
	if (user.google_accessToken) {
		throwErrors(["Please sign-in using google"]);
	}
	const validPassword = await bcrypt.compare(args.password, user.password);
	if (!validPassword && !user.google_accessToken) {
		throwErrors(["Invalid credentials"]);
	}
	return {
		userId: user.id,
		token: createToken(user.id),
		expiresIn: 1
	};
};

const loginWithGoogle = async (root, args, context) => {
	const res = await fetch(`https://www.googleapis.com/plus/v1/people/me?access_token=${args.google_accessToken}&scope=openid%20profile%20email`);
	const data = await res.json();
	let user = await context.db.user.findFirst({
		where: { oauth_id: data.id }
	});
	if (!user) {
		const email = data.emails[0].value;
		const file_data = {
			filename: "undefined",
			mimetype: "undefined",
			encoding: "undefined",
			url: data.image.url
		};
		const file = await connectIfUrlExists(context, file_data);
		user = await context.db.user.create({
			data: {
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
		});
	}
	if (user.google_accessToken) {
		return {
			userId: user.id,
			token: createToken(user.id),
			expiresIn: 1
		};
	}
	let errors;
	if (user.facebook_accessToken) {
		errors = ["Already signed up with Facebook,Please sign in using Facebook."];
	} else {
		errors = ["Account not connected with Google, use email/password."];
	}
	const ERROR = CreateValidationError(errors);
	throw new ERROR();
};

const loginWithFacebook = async (root, args, context) => {
	const res = await fetch(`https://graph.facebook.com/me?access_token=${args.facebook_accessToken}&fields=name%2Cemail%2Cpicture`);
	const data = await res.json();
	let user = await context.db.user.findFirst({
		where: { oauth_id: data.id }
	});
	if (!user) {
		let file;
		if (data.profile) {
			const file_data = {
				filename: "undefined",
				mimetype: "undefined",
				encoding: "undefined",
				url: data.profile.data.url
			};
			file = await connectIfUrlExists(context, file_data);
		}
		const userParams = {
			email: data.email,
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
		};
		if (file) {
			userParams.profile_photo = { connect: { id: file.id } };
		}
		user = await context.db.user.create({
			data: userParams
		});
	}
	if (user.facebook_accessToken) {
		return {
			userId: user.id,
			token: createToken(user.id),
			expiresIn: 1
		};
	}
	let errors;
	if (user.google_accessToken) {
		errors = ["Already signed up with Google,Please sign in using Google."];
	} else {
		errors = ["Account not connected with Facebook, use email/password."];
	}
	const ERROR = CreateValidationError(errors);
	throw new ERROR();
};

const signUp = async (root, args, context) => {
	const usedOAUTH = args.google_accessToken || args.facebook_accessToken;
	if (usedOAUTH) {
		if (args.google_accessToken) {
			return loginWithGoogle(undefined, { google_accessToken: args.google_accessToken }, context);
		}
		return loginWithFacebook(undefined, { facebook_accessToken: args.facebook_accessToken }, context);
	}

	const errors = await checkValidation(signUpSchema, args, false);
	if (errors.length) {
		const ERROR = CreateValidationError(errors);
		throw new ERROR();
	}

	let profile_photo;
	const withUrl = {
		filename: "undefined",
		mimetype: "undefined",
		encoding: "undefined"
	};
	if (args.profile_photo) {
		if (args.profile_photo.createWithBase64) {
			const base64 = args.profile_photo.createWithBase64.base64;
			const mimetype = args.profile_photo.createWithBase64.mimetype;
			profile_photo = await fileHandling.processUpload(base64, mimetype, context);
		} else if (args.profile_photo.createWithUrl) {
			withUrl.url = args.profile_photo.createWithUrl.url;
			profile_photo = await connectIfUrlExists(context, withUrl);
		}
	} else {
		withUrl.url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6";
		profile_photo = await connectIfUrlExists(context, withUrl);
	}

	const userParams = {
		email: args.email,
		full_name: args.full_name,
		password: await bcrypt.hash(args.password, saltRounds),
		role: "MEMBER",
		libraries: {
			create: {
				name: "First Library",
				custom_updatedAt: new Date()
			}
		},
		oauth_id: uuid()
	};
	if (args.job) {
		userParams.job = {
			connect: { id: args.job }
		};
	}
	if (profile_photo) {
		userParams.profile_photo = {
			connect: { id: profile_photo.id }
		};
	}

	try {
		const user = await context.db.user.create({ data: userParams });
		return {
			userId: user.id,
			token: createToken(user.id),
			expiresIn: 1
		};
	} catch (error) {
		if (error.code === "P2002") {
			const ERROR = CreateValidationError(["Email is already taken."]);
			throw new ERROR();
		}
		throw error;
	}
};

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: true,
	auth: {
		user: "gjergjk71@gmail.com",
		pass: "somepass"
	}
});

const forgetPassword = async (root, args, context) => {
	if (!args.email) {
		throw new Error("email arg can't be empty");
	}
	const user = await context.db.user.findUnique({
		where: { email: args.email }
	});
	if (!user) {
		return {
			success: false,
			error: `No user found with email ${args.email}`
		};
	}
	const token = jwt.sign({
		forgotPassword: user.id
	}, process.env.jwt_forgotPassword_secret);
	const data = {
		from: "Mailgun Sandbox <postmaster@sandbox7c10cba56e9a4f0f9b23c09194475167.mailgun.org>",
		to: `${user.full_name} <${user.email}>`,
		subject: "UX-Stories: Forgot password",
		text: `Here it is ${`${process.env.URI}/reset/${token}`}!`
	};
	mailgun.messages().send(data, (err, body) => {
		console.log(err, body);
	});
	return { success: true };
};

const verifyForgotPassword = async (root, args) => {
	if (!args.token) {
		throw new Error("Token can't be empty");
	}
	return jwt.verify(args.token, process.env.jwt_forgotPassword_secret, err => {
		return { valid: !err };
	});
};

const resetPassword = async (root, args, context) => {
	if (!args.token || !args.new_password || !args.repeat_new_password) {
		throw new Error("token,new_password or repeat_new_password can't be empty");
	}
	if (args.new_password !== args.repeat_new_password) {
		return {
			success: false,
			error: "Password do not match"
		};
	}
	const decoded = await jwt.verify(args.token, process.env.jwt_forgotPassword_secret, (err, payload) => {
		if (err) {
			return new Error("Invalid token");
		}
		return payload;
	});
	if (decoded.message) {
		return {
			success: false,
			error: decoded.message
		};
	}
	try {
		await context.db.user.update({
			data: {
				password: await bcrypt.hash(args.new_password, saltRounds)
			},
			where: { id: decoded.forgotPassword }
		});
	} catch (error) {
		return { success: false, error };
	}
	return { success: true };
};

module.exports = {
	login,
	loginWithGoogle,
	loginWithFacebook,
	signUp,
	forgetPassword,
	verifyForgotPassword,
	resetPassword
};
