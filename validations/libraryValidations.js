const yup = require("yup");
const { StoryLinkType } = require("./commonFields");

const librariesSchema = yup.object().shape({
    libraryFilterInput: yup.object()
        .default(null)
        .nullable()
        .shape({
            storyCategories: yup.array().of(yup.string()),
            storyElements: yup.array().of(yup.string())
        })
})

const librarySchema = yup.object().shape({
    id: yup.string().required()
})

const createLibrarySchema = yup.object().shape({
    name: yup.string().required()
})

const editLibrarySchema = yup.object().shape({
    id: yup.string().required(),
    name: yup.string(),
    stories: StoryLinkType
})

module.exports = {
    librariesSchema,
    librarySchema,
    createLibrarySchema,
    editLibrarySchema
}