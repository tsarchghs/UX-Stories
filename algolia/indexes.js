const client = require("./client");

const appsIndex = client.initIndex("apps_index");
const storiesIndex = client.initIndex("stories_index");

appsIndex.setSettings({
    searchableAttributes:[
        "name"
    ],
    attributesForFaceting: [
        "appCategory.name"
    ]
})

storiesIndex.setSettings({
    searchableAttributes: [
        "storyCategories.name"
    ]
})

module.exports = {
    appsIndex,
    storiesIndex
}