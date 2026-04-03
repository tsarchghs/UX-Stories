const jobs = async (root, args, context) => {
	return context.db.job.findMany();
};

const createJob = async (root, args, context) => {
	if (!args.name) {
		throw new Error("name arg is empty");
	}
	return context.db.job.create({
		data: { name: args.name }
	});
};

const editJob = async (root, args, context) => {
	if (!args.id || !args.name) {
		throw new Error("id or name is empty");
	}
	return context.db.job.update({
		data: { name: args.name },
		where: { id: args.id }
	});
};

const deleteJob = async (root, args, context) => {
	if (!args.id) {
		throw new Error("id is empty");
	}
	return context.db.job.delete({
		where: { id: args.id }
	});
};

module.exports = {
	jobs,
	createJob,
	editJob,
	deleteJob
};
