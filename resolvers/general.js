const permissions = require("./permissions");

const getObjectConnection = async (parent,args,context,info) => {
	permissions.loginPermissions(context,"ADMIN")
	let filterBy = {where:{}}
	for (var x in args.filterBy){
		obj = args.filterBy[x];
		filterBy[obj.key] = obj.value_str !== undefined ? obj.value_str : obj.value_int 
	}
	for (var x in args.where){
		obj = args.where[x];
		filterBy["where"][obj.key] = obj.value_str !== undefined ? obj.value_str : obj.value_int 
	}
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

module.exports = {
	getObjectConnection
}