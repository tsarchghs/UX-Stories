const pageViews = (root, args, context) => {
	const where = {
		pathname: args.pathname
	};
	if (args.user) {
		where.userId = args.user;
	}
	return context.db.pageView.findMany({ where });
};

const createPageView = (root, args, context) => {
	const data = { ...args };
	if (args.user) {
		data.user = { connect: { id: args.user } };
		delete data.userId;
	}
	return context.db.pageView.create({ data });
};

const PageView = {
	user: (parent, args, context) => parent.userId ? context.db.user.findUnique({
		where: { id: parent.userId }
	}) : null
};

module.exports = {
	pageViews,
	createPageView,
	PageView
};
