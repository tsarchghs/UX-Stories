const yup = require("yup");
const { profilePhotoSchema } = require("./commonFields");

// key names depedent from formatted_data generated from createObject resolver
const createUserSchema = yup.object().shape({
    full_name: yup.string().required().min(2),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    jobs: yup.string(), // "jobs" because that's how it is from formatted_data
})

const editProfileSchema = yup.object().shape({
    full_name: yup.string().min(2),
    email: yup.string().required().email(),
    password: yup.string().min(6),
    job: yup.string(),
    profile_photo: profilePhotoSchema
})

module.exports = {
    createUserSchema,
    editProfileSchema
}