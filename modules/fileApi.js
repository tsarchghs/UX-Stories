const uuid = require("uuid");
const fs = require("fs");
const configs = require("../configs");
const { aws, S3 } = require("../aws");

const get_extension = (encoded) => {
	if (encoded[0] == "/") {
		return "jpg"
	} else if (encoded[0] == "i") {
		return "png"
	} else if (encoded[0] == "R") {
		return "gif"
	} else if (encoded[0] == "U") {
		return "webp"
	}
}

const processUpload = async (upload, mimetype, context, save_encoding = false) => {
	if (!upload) {
		return console.log("ERROR: No file received");
	}
	let imgdata = upload
	let extension = get_extension(imgdata)
	let filename = `file-${uuid()}`;
	let base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
	let buff = new Buffer(base64Data, "base64");
	// fs.writeFileSync(__dirname + "/../public" + path, base64Data,  {encoding: 'base64'});
	let s3_data = {
		Key: filename,
		Body: buff,
		ContentEncoding: "base64",
		ContentType: mimetype ? mimetype : "image/png"
	}

	S3.putObject(s3_data, console.log)
	console.log(`http://gkrp-porfolio-bucket.s3.amazonaws.com/${filename}`);
	let fileData = {
		filename: filename,
		mimetype: mimetype,
		encoding: "",
		url: `http://gkrp-porfolio-bucket.s3.amazonaws.com/${filename}`
	}
	return context.db.file.create({
		data: fileData
	});
}

module.exports = {
	get_extension,
	processUpload
}
