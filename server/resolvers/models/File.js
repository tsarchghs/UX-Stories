const { processUpload } = require("../../modules/fileApi");

const uploadFile = async (parent,{ file },context,info) => {
	var file = await processUpload(file.base64,file.mimetype, context);
	return file
}

module.exports = {
	uploadFile
}