const Video = {
	file: (parent, args, context) => context.db.file.findUnique({
		where: { id: parent.fileId }
	})
};

module.exports = {
	Video
};
