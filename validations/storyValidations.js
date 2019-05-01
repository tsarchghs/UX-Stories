const yup = require("yup");

// key names depedent from formatted_data generated from createObject resolver
const createStorySchema = yup.object().shape({
    apps: yup.string(),
    video: yup.string().required("Video is required"),
    thumbnail: yup.string().required("Thumbnail is required"),
    appVersions: yup.array().of(yup.string()),
    storyCategories: yup.array().of(yup.string()),
    storyElements: yup.array().of(yup.string())
})

module.exports = {
    createStorySchema
}