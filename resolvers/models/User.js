const fileHandling = require("../../modules/fileApi");
const permissions = require("../permissions");
const bcrypt = require("bcryptjs");
const { checkValidation } = require("../../helpers");
const { editProfileSchema } = require("../../validations/userValidations");
const stripe = require("stripe")(process.env.stripe_secret_key);

const saltRounds = 10;

const countUsers = async (parent, args, context) => {
	return context.db.user.count();
};

const users = async (parent, args, context) => {
	const prismaArgs = {};
	if (args.userFilterInput) {
		if (args.userFilterInput.full_name_contains) {
			prismaArgs.where = {
				full_name: { contains: args.userFilterInput.full_name_contains }
			};
		}
		if (args.userFilterInput.first) {
			prismaArgs.take = args.userFilterInput.first;
		}
		if (args.userFilterInput.skip) {
			prismaArgs.skip = args.userFilterInput.skip;
		}
	}
	return context.db.user.findMany(prismaArgs);
};

const editProfile = async (parent, args, context) => {
	await checkValidation(editProfileSchema, args);
	permissions.loginPermission(context, "MEMBER");
	if (
		!args.full_name &&
		!args.job &&
		!args.email &&
		!args.password &&
		!args.profile_photo
	) {
		throw new Error("At least one argument must be specified");
	}

	const data = {};
	if (args.full_name) data.full_name = args.full_name;
	if (args.email) data.email = args.email;
	if (args.job) data.job = { connect: { id: args.job } };
	if (args.password) {
		data.password = await bcrypt.hash(args.password, saltRounds);
	}
	if (args.profile_photo && args.profile_photo.createWithBase64) {
		const photo_data = args.profile_photo.createWithBase64;
		const profile_image = await fileHandling.processUpload(photo_data.base64, photo_data.mimetype, context);
		data.profile_photo = { connect: { id: profile_image.id } };
	}
	return context.db.user.update({
		data,
		where: { id: context.user.id }
	});
};

const getLoggedInUser = async (parent, args, context) => {
	if (!context.user) {
		return undefined;
	}
	return context.db.user.findUnique({
		where: { id: context.user.id }
	});
};

const getDefaultSource = (sources, source_id) => {
	for (const source of sources) {
		if (source.id === source_id) {
			return source;
		}
	}
	return undefined;
};

const User = {
	job: (parent, args, context) => parent.jobId ? context.db.job.findUnique({
		where: { id: parent.jobId }
	}) : null,
	profile_photo: (parent, args, context) => parent.profile_photoId ? context.db.file.findUnique({
		where: { id: parent.profile_photoId }
	}) : null,
	apps: async (parent, args, context) => {
		const record = await context.db.user.findUnique({
			where: { id: parent.id },
			select: { apps: true }
		});
		return record ? record.apps : [];
	},
	libraries: async (parent, args, context) => {
		const record = await context.db.user.findUnique({
			where: { id: parent.id },
			select: { libraries: true }
		});
		return record ? record.libraries : [];
	},
	pageViews: async (parent, args, context) => {
		const record = await context.db.user.findUnique({
			where: { id: parent.id },
			select: { pageViews: true }
		});
		return record ? record.pageViews : [];
	},
	_subscription: async (parent, args, context) => {
		if (!context.user.subscription_id) {
			return undefined;
		}
		const subs = await stripe.subscriptions.retrieve(context.user.subscription_id);
		return {
			id: subs.id,
			status: subs.status,
			cancel_at_period_end: subs.cancel_at_period_end
		};
	},
	invoices: async (parent, args, context) => {
		const subscription_id = context.user.subscription_id;
		const customer_id = context.user.customer_id;
		if (!subscription_id || !customer_id) {
			return [];
		}
		const res_invoices = await stripe.invoices.list({ customer: customer_id });
		const invoices = res_invoices.data;
		const formatted = [];
		for (const invoice of invoices) {
			const charge = await stripe.charges.retrieve(invoice.charge);
			formatted.push({
				...invoice,
				last4: charge.source.last4
			});
		}
		return formatted;
	},
	customer: async (parent, args, context) => {
		const customer_id = context.user.customer_id;
		if (!customer_id) {
			return undefined;
		}
		const customer = await stripe.customers.retrieve(customer_id);
		return {
			...customer,
			source: getDefaultSource(customer.sources.data, customer.default_source)
		};
	}
};

module.exports = {
	users,
	getLoggedInUser,
	editProfile,
	countUsers,
	User
};
