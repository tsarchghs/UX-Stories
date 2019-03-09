const uuid = require("uuid");
const aws = require("aws-sdk");

const s3 = new aws.S3({
	accessKeyId: "foo",
	secretAccessKey: "bar",
	params: {
		Bucket: "com.prisma.s3"
	},
	endpoint: new aws.Endpoint("http://localhost:4569")
})

exports.processUpload = async (upload,context) => {
	if (!upload) {
		return console.log("ERROR: No file received");
	}
	const { stream, filename, mimetype, encoding } = await upload 
	const key = uuid() + '-' + filename

	const response = await s3
		.upload({
			Key: key,
			ACL: "public-read",
			Body: stream
		}).promise()
	const url = response.Location;

	const data = {
		filename,
		mimetype,
		encoding,
		url
	}
	const { id } = await context.prisma.createFile({
		...data
	})
	const file = {
		id,
		filename,
		mimetype,
		encoding,
		url
	}
	console.log("Saved prisma file:");
	console.log(file);
	return file;
}