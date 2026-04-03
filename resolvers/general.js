const permissions = require("./permissions");
const fileHandling = require("../modules/fileApi");
const { checkValidation } = require("../helpers.js");
const { createAppSchema } = require("../validations/appValidations");
const { createStorySchema } = require("../validations/storyValidations");
const { createUserSchema } = require("../validations/userValidations");
const { nameOnlyRequired } = require("../validations/commonFields");
const bcrypt = require("bcryptjs");
const {
	connectionTypeToModel,
	deleteTypeToModel,
	getAdminConfig,
	getAdminRecord,
	legacyOrderBy,
	mutationTypeToModel,
	queryTypeToModel
} = require("../prismaHelpers");

const saltRounds = 10;

const buildLegacyQueryArgs = (filterBy = [], where = []) => {
	const prismaArgs = {};
	const prismaWhere = {};

	[...filterBy, ...where].forEach(item => {
		if (!item || !item.key) {
			return;
		}
		const value = item.value_str !== undefined ? item.value_str : item.value_int;
		if (item.key === "first") {
			prismaArgs.take = item.value_int;
			return;
		}
		if (item.key === "skip") {
			prismaArgs.skip = item.value_int;
			return;
		}
		if (item.key === "orderBy") {
			prismaArgs.orderBy = legacyOrderBy(item.value_str);
			return;
		}
		if (item.key.endsWith("_contains")) {
			const field = item.key.replace(/_contains$/, "");
			prismaWhere[field] = { contains: item.value_str };
			return;
		}
		prismaWhere[item.key] = value;
	});

	if (Object.keys(prismaWhere).length) {
		prismaArgs.where = prismaWhere;
	}

	return prismaArgs;
};

const fetchAdminRecord = async (context, model, id) => {
	const record = await getAdminRecord(context.db, model, { id });
	return getAdminConfig(model).serialize(record);
};

const getObject = async (parent, args, context) => {
	const model = queryTypeToModel[args.query_type];
	const record = await getAdminRecord(context.db, model, { id: args.id });
	return { repr: JSON.stringify(getAdminConfig(model).serialize(record)) };
};

const getObjectConnection = async (parent, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	const model = connectionTypeToModel[args.connection_type];
	const config = getAdminConfig(model);
	const prismaArgs = buildLegacyQueryArgs(args.filterBy, args.where);
	const nodes = await context.db[config.delegate].findMany({
		...prismaArgs,
		include: config.include
	});
	const totalCount = await context.db[config.delegate].count({
		where: prismaArgs.where
	});
	const take = prismaArgs.take || nodes.length || 0;
	const skip = prismaArgs.skip || 0;
	const serialized = nodes.map(config.serialize);
	return {
		id: `${args.connection_type}:${skip}:${take}`,
		pageInfo: {
			hasNextPage: skip + take < totalCount,
			hasPreviousPage: skip > 0
		},
		nodes: { repr: JSON.stringify(serialized) },
		aggregate: { count: totalCount }
	};
};

const validateMutationData = async (mutationType, formattedData) => {
	if (mutationType === "createApp") {
		return checkValidation(createAppSchema, formattedData);
	}
	if (mutationType === "createStory") {
		return checkValidation(createStorySchema, formattedData);
	}
	if (mutationType === "createUser") {
		return checkValidation(createUserSchema, formattedData);
	}
	return checkValidation(nameOnlyRequired, formattedData);
};

const buildMutationData = async (formatted_data, fields_info, context, mutationType, isUpdate = false) => {
	const valid_data = {};
	for (const key of Object.keys(formatted_data)) {
		let field_info;
		fields_info.forEach(f_info => {
			if (f_info === "createdBy" || f_info.queryName === "createdBy") {
				if (valid_data.createdBy === undefined) {
					valid_data.createdBy = { connect: { id: context.user.id } };
				}
			}
			if (f_info === key || f_info.queryName === key) {
				field_info = f_info;
			}
		});

		await validateMutationData(mutationType, formatted_data);

		if (!field_info) {
			throw new Error(`field_info arg missing info for ${key}`);
		}

		const createFieldName = field_info.create_queryName ? field_info.create_queryName : key;
		if (typeof field_info === "string" || field_info.primitive) {
			valid_data[key] = formatted_data[key];
			continue;
		}
		if (field_info.options) {
			valid_data[createFieldName] = formatted_data[key];
			continue;
		}
		if (field_info.type === "password") {
			valid_data[createFieldName] = await bcrypt.hash(formatted_data[key], saltRounds);
			continue;
		}
		if (field_info.type === "file" || field_info.type === "video") {
			const mimetype = field_info.type === "file" ? "image/png" : "video/mp4";
			const base64 = formatted_data[key];
			if (!base64 && isUpdate) {
				continue;
			}
			const file = await fileHandling.processUpload(base64, mimetype, context);
			if (field_info.type === "file") {
				valid_data[createFieldName] = { connect: { id: file.id } };
			} else {
				valid_data[createFieldName] = {
					create: {
						file: { connect: { id: file.id } }
					}
				};
			}
			continue;
		}
		if (field_info.hasManyCreate) {
			const links = formatted_data[key].map(obj_id => ({ id: obj_id }));
			valid_data[createFieldName] = { connect: links };
			continue;
		}
		if (!field_info.primitive) {
			valid_data[createFieldName] = { connect: { id: formatted_data[key] } };
		}
	}
	return valid_data;
};

const parseMutationPayload = args => {
	const valid_json = args.data.repr.replace(/'/g, "\"");
	const fields_info = JSON.parse(args.fields_info.repr);
	let data = JSON.parse(valid_json);
	data = data.map(x => JSON.parse(x));
	const formatted_data = {};
	data.forEach(obj => Object.keys(obj).forEach(key => {
		formatted_data[key] = obj[key];
	}));
	return { fields_info, formatted_data };
};

const createObject = async (parent, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	const { fields_info, formatted_data } = parseMutationPayload(args);
	const valid_data = await buildMutationData(formatted_data, fields_info, context, args.mutation_type);
	const model = mutationTypeToModel[args.mutation_type];
	const config = getAdminConfig(model);
	const created = await context.db[config.delegate].create({
		data: valid_data
	});
	return {
		id: created.id,
		repr: JSON.stringify(await fetchAdminRecord(context, model, created.id))
	};
};

const updateObject = async (parent, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	const { fields_info, formatted_data } = parseMutationPayload(args);
	const valid_data = await buildMutationData(formatted_data, fields_info, context, args.mutation_type, true);
	const model = mutationTypeToModel[args.mutation_type];
	const config = getAdminConfig(model);
	await context.db[config.delegate].update({
		data: valid_data,
		where: { id: args.id }
	});
	return {
		id: args.id,
		repr: JSON.stringify(await fetchAdminRecord(context, model, args.id))
	};
};

const deleteObject = async (parent, args, context) => {
	permissions.loginPermission(context, "ADMIN");
	const model = deleteTypeToModel[args.delete_type];
	const config = getAdminConfig(model);
	const deleted = await context.db[config.delegate].delete({
		where: { id: args.id },
		include: config.include
	});
	return {
		repr: JSON.stringify(config.serialize(deleted))
	};
};

module.exports = {
	getObjectConnection,
	getObject,
	deleteObject,
	createObject,
	updateObject
};
