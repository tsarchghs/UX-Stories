const { processUpload } = require("../../modules/fileApi");

const uploadFile = async (parent,{ file },context,info) => {
	var file = await file;
	return processUpload(file, context);
}

module.exports = {
	uploadFile
}