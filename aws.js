const configs = require("./configs");
const aws = require("aws-sdk");

aws.config.update({
    secretAccessKey: configs.s3.secretAccessKey,
    accessKeyId: configs.s3.accessKeyId,
    region: "us-east-1"
})

const S3 = new aws.S3({
    params: { Bucket: "uxstories" }
});

module.exports = {
    aws,
    S3
};