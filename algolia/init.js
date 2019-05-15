const { appsIndex, storiesIndex } = require("./indexes");
const prismaDb = require("../prismaDb");
const { appsInfo, storiesInfo } = require("../prismaInfo");

const init = async () => {
    let infos = [
        {
            index: appsIndex,
            query:"apps",
            prismaInfo: appsInfo
        }, 
        {
            index: storiesIndex,
            query: "stories",
            prismaInfo: storiesInfo
        }
    ];
    for (var x in infos){
        let info = infos[x];
        let objectsBrowser = info.index.browseAll()
        objectsBrowser.on("result",async data => {
            let all_objects = await prismaDb.query[info.query]({},info.prismaInfo);
            let objectsOnIndex = data.hits.map(hit => hit.objectID);
            let new_objects = []
            // add objects not in index currently
            all_objects.map(obj => {
                if (objectsOnIndex.indexOf(obj.id) === -1){
                    obj.objectID = obj.id
                    new_objects.push(obj);
                }
            })
            // delete objects that are in index but not in db
            let deleteObjects = []
            all_objects_ids = all_objects.map(obj => obj.id);
            objectsOnIndex.map(objectID => {
                if (all_objects_ids.indexOf(objectID) === -1){
                    deleteObjects.push(objectID)
                }
            })
            info.index.addObjects(new_objects);
            info.index.deleteObjects(deleteObjects);
        })
    }
}

module.exports = init