const yup = require("yup");

const platform = yup.string().oneOf(["IOS","ANDROID"])

const LinkType = yup.string().oneOf(["connect", "disconnect"]);

const StoryLinkType = yup.array().of(
    yup.object().shape({
        story: yup.string().required(),
        type: LinkType.required()
    })
)

const FileInputCreateWithBase64 = yup.object().default(null).nullable().shape({
    base64: yup.string().required(),
    mimetype: yup.string().required()
})
const FileInputCreateWithUrl = yup.object().default(null).nullable().shape({
    url: yup.string().required()
})

const profilePhotoSchema = yup.object().default(null).nullable().shape({
    createWithBase64: FileInputCreateWithBase64,
    createWithUrl: FileInputCreateWithUrl
})

const nameOnlyRequired = yup.object().shape({
    name: yup.string().required()
})

module.exports = {
    platform,
    LinkType,
    StoryLinkType,
    profilePhotoSchema,
    nameOnlyRequired
}
