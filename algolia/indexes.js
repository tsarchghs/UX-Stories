const client = require("./client");

const appsIndex = client.initIndex("apps_index");
const storiesIndex = client.initIndex("stories_index");

appsIndex.setSettings({
    searchableAttributes:[
        "name"
    ],
    attributesForFaceting: [
        "id",
        "appCategory.name"
    ]
})

storiesIndex.setSettings({
    searchableAttributes: [
        "storyCategories.name"
    ],
    attributesForFaceting: [
        "id",
        "app.id",
        "appVersions.name",
        "app.appCategory.name",
        "storyCategories.name",
        "storyElements.name"
    ],
    
})

module.exports = {
    appsIndex,
    storiesIndex
}