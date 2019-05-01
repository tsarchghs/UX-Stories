const yup = require("yup");
const { platform } = require("./commonFields");

// key names depedent from formatted_data generated from createObject resolver
const createAppSchema = yup.object().shape({
    logo: yup.string().required("Logo is required"),
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    platform: platform,
    appVersion: yup.array().of(yup.string()),
    appCategories: yup.string()
})

module.exports = {
    createAppSchema
}