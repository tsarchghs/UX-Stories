const { proccessUpload } = require("../../modules/fileApi");

const uploadFile = async (parent,{ file },context,info) => {
	var file = await file;
	return proccessUpload(file, ctx);
}

module.exports = {
	uploadFile
}