const permissions = require("./permissions");

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
	return data;
}

const createObject = async (parent,args,context) => {
	permissions.loginPermission(context,"ADMIN")
	valid_json = args.data.repr.replace(/'/g, '"')
	let data = JSON.parse(valid_json);
	let obj = await context.db.mutation[args.mutation_type]({data},`
		{
			${args.fields ? args.fields.join() : "id"}
		}
	`);
	return { repr: JSON.stringify(obj) }
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