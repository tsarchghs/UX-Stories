const uuid = require("uuid");
const aws = require("aws-sdk");
const fs = require("fs");

const get_extension = (encoded) => {
	if (encoded[0] == "/"){
		return "jpg"
	} else if (encoded[0] == "i") {
		return "png"
	} else if (encoded[0] == "R"){
		return "gif"
	} else if (encoded[0] == "U") {
		return "webp"
	}
} 

exports.processUpload = async (upload,context) => {
	if (!upload) {
		return console.log("ERROR: No file received");
	}
	const imgdata = upload
	const extension = get_extension(imgdata)
	const filename = `img-${uuid()}`;
	const path = `/images/${filename}.${extension}`

	const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	fs.writeFileSync(__dirname + "../../public" + path, base64Data,  {encoding: 'base64'});


	const data = {
		filename: filename, 
		mimetype: "todo",
		encoding: imgdata,
		url: "http://localhost:4000/static" + path
	}
	const file = await context.prisma.createFile({
		...data
	})
	return file;
}