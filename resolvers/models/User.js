const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");
const bcrypt = require("bcrypt");
const { checkValidation } = require("../../helpers");
const { editProfileSchema } = require("../../validations/userValidations");
const stripe = require('stripe')(process.env.stripe_secret_key);
const fetch = require('node-fetch');

const saltRounds = 10;

const countUsers = async (parent,args,context) => {
	let data = await context.db.query.usersConnection({},`
			{
				aggregate { count }
			}
		`)
	return data.aggregate.count;
}

const users = async (parent,args,context,info) => {
	// permissions.loginPermission(context,"ADMIN");
	let filterBy = {}
	if (args.userFilterInput){
		if (args.userFilterInput.full_name_contains){
			filterBy["where"] = {full_name_contains:args.userFilterInput.full_name_contains}
		}
		if (args.userFilterInput.first) filterBy["first"] = args.userFilterInput.first
		if (args.userFilterInput.first) filterBy["skip"] = args.userFilterInput.skip
	}
	let data = await context.db.query.users(filterBy,info)
	return data;
}

const editProfile = async (parent,args,context,info) => {
	await checkValidation(editProfileSchema,args);
	permissions.loginPermission(context,"MEMBER");
	console.log(args);
	if (
		!args.full_name &&
		!args.job &&
		!args.email &&
		!args.password &&
		!args.profile_photo
	) {
		throw new Error("At least one argument must be specified");
	}
	let data = {}
	if (args.full_name) data["full_name"] = args.full_name;
	if (args.email) data["email"] = args.email
	if (args.job) data["job"] = {connect:{id:args.job}}
		
	if (args.password) {
		data["password"] = await bcrypt.hash(args.password,saltRounds);
	}
	if (args.profile_photo && args.profile_photo.base64 && args.profile_photo.mimetype){
		let photo_data = args.profile_photo.createWithBase64
		const profile_image = await fileHandling.processUpload(photo_data.base64,photo_data.mimetype,context);
		data["profile_photo"] = {connect:{id:profile_image.id}};
	}
	return await context.db.mutation.updateUser({data,where:{id:context.user.id}},info);
}

const getLoggedInUser = async (parent,args,context,info) => {
	if (!context.user){
		return undefined;
	}
	return await context.db.query.user({
		where:{id:context.user.id}
	},info);
}

const getDefaultSource = (sources,source_id) => {
	for (var x in sources){
		if (sources[x].id === source_id) return sources[x];
	}
}
const User = {
	subscription: async (parent,args,context) => {
		if (!context.user.subscription_id){
			return undefined
		}
		let subs = await stripe.subscriptions.retrieve(context.user.subscription_id);
		return {
			id: subs.id,
			status: subs.status,
			cancel_at_period_end: subs.cancel_at_period_end
		};
	},
	invoices: async (parent,args,context) => {
		let subscription_id = context.user.subscription_id;
		let customer_id = context.user.customer_id;
		if (!subscription_id || !customer_id){
			return []	
		}
		let subscription = parent.subscription;
		if (subscription){
			subscription = await stripe.subscriptions.retrieve(subscription_id);
		}
		let res_invoices = await stripe.invoices.list({customer: customer_id})
		let invoices = res_invoices.data
		let formatted = []
		for (let x in invoices){
			let invoice = invoices[x];
			let charge = await stripe.charges.retrieve(invoice.charge)
			formatted.push({
				...invoice,
				last4: charge.source.last4
			})
		}
		return formatted;
	},
	customer: async (parent,args,context) => {
		let customer_id = context.user.customer_id;
		if (!customer_id) return undefined;
		let customer = await stripe.customers.retrieve(customer_id);
		console.log(JSON.stringify(customer),555)
		return {
			...customer,
			source: getDefaultSource(customer.sources.data,customer.default_source)
		}

	}
}

module.exports = {
	users,
	getLoggedInUser,
	editProfile,
	countUsers,
	User
}