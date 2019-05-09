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
            let objectsOnIndex = data.hits.map(hit => hit.id);
            let new_objects = []
            all_objects.map(obj => {
                if (objectsOnIndex.indexOf(obj.id) === -1){
                    new_objects.push(obj);
                }
            })
            info.index.addObjects(new_objects);
        })
    }
}

module.exports = init