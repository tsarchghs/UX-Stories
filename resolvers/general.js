const permissions = require("./permissions");
const uuid = require("uuid");
const fileHandling = require("../modules/fileApi");

const getObjectConnection = async (parent,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	let filterBy = {where:{}}
	for (var x in args.filterBy){
		obj = args.filterBy[x];
		filterBy[obj.key] = obj.value_str !== undefined ? obj.value_str : obj.value_int 
	}
	for (var x in args.where){
		obj = args.where[x];
		filterBy["where"][obj.key] = obj.value_str !== undefined ? obj.value_str : obj.value_int 
	}
	console.log(args.filterBy,args.where)
	let data = await context.db.query[args.connection_type](filterBy,`
	    {
	    	edges {
		      node {
					${args.fields.join()}
		    	}
		    }
		    aggregate {
		      count
		    }
		    pageInfo{
		      hasNextPage
		      hasPreviousPage
		    }
		}
	`);
	data.nodes = { repr : JSON.stringify(data.edges.map(edge => edge.node)) };
	return { id: uuid(), ...data };
}

const createObject = async (parent,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	valid_json = args.data.repr.replace(/'/g, '"')
	let fields_info = JSON.parse(args.fields_info.repr);
	let data = JSON.parse(valid_json);
	data = data.map(x => JSON.parse(x))
	formatted_data = {}
	data.map(obj => Object.keys(obj).map(key => formatted_data[key] = obj[key]));
	let valid_data = {}
	for (var x in formatted_data){
		let field_info;
		fields_info.map(f_info => {
			if (f_info === "createdBy" || f_info.queryName === "createdBy"){
				if (valid_data["createdBy"] === undefined){
					valid_data["createdBy"] = { connect: { id: context.user.id }}
				}
			}
			if (f_info === x || f_info.queryName === x){
				 field_info = f_info
			}
		});
		if (!field_info){
			throw new Error(`field_info arg missing info for ${x}`)
		}
		if (typeof(field_info) === "string" || field_info.primitive) valid_data[x] = formatted_data[x]
		let createFieldName = field_info.create_queryName ? field_info.create_queryName : x
		if (field_info.options) {
			valid_data[createFieldName] = formatted_data[x]
		} else if (field_info.type === "file" || field_info.type === "video"){
			let mimetype = field_info.type === "file" ? "image/png" : "video/mp4"
			let base64 = formatted_data[x] 
			let file = await fileHandling.processUpload(base64,
					mimetype,
					context
				);
			if (field_info.type === "file"){
				valid_data[createFieldName] = { connect: { id: file.id } }
			} else {
				valid_data[createFieldName] = { create: { file: { connect: { id: file.id } } } }
			}
		} else if (!field_info.hasManyCreate && !field_info.primitive){
			valid_data[createFieldName] = { connect: { id: formatted_data[x] } }
		} else if (field_info.hasManyCreate){
			links = formatted_data[x].map(obj_id => ({id : obj_id }));
			valid_data[createFieldName] = { connect: links }
		} else if (!field_info.primitive){
			valid_data[createFieldName] = { connect: { id: formatted_data[x] } }
		}
	}
	let obj = await context.db.mutation[args.mutation_type]({data:valid_data},`
		{
			${args.fields ? args.fields.join() : "id"}
		}
	`);
	return { id: obj.id, repr: JSON.stringify(obj) }
}

	const deleteObject = async (parent,args,context) => {
		let data = await context.db.mutation[args.delete_type]({
		where:{id:args.id}},`
			{
				${args.fields ? args.fields.join() : "id"}
			}
		`
	)
	return { repr: JSON.stringify(data) }
}

module.exports = {
	getObjectConnection,
	deleteObject,
	createObject
}