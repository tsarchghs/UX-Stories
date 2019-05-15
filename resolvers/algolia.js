const { appsIndex, storiesIndex } = require("../algolia/indexes");
const prismaDb = require("../prismaDb");
const { appsInfo, storiesInfo } = require("../prismaInfo");

const getInfo = (args,type) => {
    let info = {}
    switch (args.indexName) {
        case "apps_index":
            info.index = appsIndex
            info.queryName = type === "get" ? "app": "deleteApp"
            info.info = appsInfo
            break
        case "stories_index":
            info.index = storiesIndex
            info.queryName = type === "get" ? "story": "deleteStory"
            info.info = storiesInfo
            break
        default:
            throw new Error("Invalid index name");
    }
    return info
}

const addAlgoliaIndex = async (root,args,context) => {
    let info = getInfo(args,"get");
    let obj = await prismaDb.query[info.queryName]({
        where: { id: args.object_id }
    }, info.info);
    obj.objectID = obj.id
    try {
        await info.index.addObject(obj);
    } catch (e) {
        console.log(e);
        return { success: false }
    }
    return { success: true }
}

const updateAlgoliaIndex = async (root,args,context) => {
    let info = getInfo(args,"get")
    let obj = await prismaDb.query[info.queryName]({
        where: { id: args.object_id }
    },info.info);
    obj.objectID = obj.id
    try {
        await info.index.partialUpdateObject(obj);
    } catch (e) {
        console.log(e);
        return { success: false }
    }
    return { success: true }
}

const deleteAlgoliaIndex = async (root,args,context) => {
    let info = getInfo(args,"delete");
    console.log(info.queryName)
    try {
        let obj = await prismaDb.mutation[info.queryName]({
            where: { id: args.object_id }
        }, info.info);
    } catch (e) {
        console.log(e);
    }
    try {
        await info.index.deleteObject(args.object_id)
    } catch (e) {
        console.log(e);
        return { success: false }
    }
    return { success: true }
}

module.exports = {
    updateAlgoliaIndex,
    deleteAlgoliaIndex,
    addAlgoliaIndex
}