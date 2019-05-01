const yup = require("yup");
const { profilePhotoSchema } = require("./commonFields");

const loginSchema = yup.object().shape({
    email: yup.string().required("Invalid credentials"),
    password: yup.string().required("Invalid credentials"),
})

const signUpSchema = yup.object().shape({
    full_name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    job: yup.string().required(),
    profile_photo: profilePhotoSchema
})

module.exports = {
    loginSchema,
    signUpSchema
}