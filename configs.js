
module.exports = {
	jwt_secret: "secret_very_secret",
	jwt_forgotPassword_secret: "forgot_password_token_secret",
	URI: "http://localhost:3000/",
	PRODUCTION: false,
	auth: {
		user: "gjergjk71@gmail.com",
		pass: "somepass"
	},
	mailgun:{
		apiKey:'36b77ddc5691055f9e2d350ab165913e-2416cf28-0ca40814',
		DOMAIN:'sandbox7c10cba56e9a4f0f9b23c09194475167.mailgun.org'
	},
	algolia_key: "12cc23032aa7443964459acf480c66bb",
        s3: {
                bucketName: "gkrp-porfolio-bucket",
                accessKeyId: "AKIASNCBWGELY5S2FZR7",
		secretAccessKey: "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"
	}
}
