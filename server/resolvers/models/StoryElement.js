
const storyElements = (root,args,context,info) => {
	return context.db.query.storyElements({},info);
}

module.exports = {
	storyElements
}