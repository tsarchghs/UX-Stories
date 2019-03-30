const permissions = require("../permissions");

const jobs = async (root,args,context) => {
	return await context.db.query.jobs();
}

const createJob = async (root,args,context) => {
	// permissions.loginPermission(context,"ADMIN")
	if (!args.name){
		throw new Error("name arg is empty");
	}
	return await context.db.mutation.createJob({
		data:{name:args.name}
	})
}

const editJob = async (root,args,context) => {
	// permissions.loginPermission(context,"ADMIN")
	if(!args.id || !args.name){
		throw new Error("id or name is empty")
	}
	return await context.db.mutation.updateJob({
		data:{name:args.name},
		where:{id:args.id}
	})
}

const deleteJob = async (root,args,context) => {
	// permissions.loginPermission(context,"ADMIN")
	if (!args.id) {
		throw new Error("id is empty");
	}
	return await context.db.mutation.deleteJob({
		where:{id:args.id}
	})
}

module.exports = {
	jobs,
	createJob,
	editJob,
	deleteJob
}
