const { processUpload } = require("../../modules/fileApi");

const uploadFile = async (parent,{ file },context,info) => {
	var file = await processUpload(file, context);
	return file
}

module.exports = {
	uploadFile
}