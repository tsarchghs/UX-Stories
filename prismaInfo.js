
const appsInfo = `
    {
        id
        name
        description
        company
        platform
        logo {
            id
            url
        }
        appCategory {
            id
            name
        }
        appCategory {
            id
            name
        }
        appVersions {
            id
            name
        }
        stories(first:3){
            id
            thumbnail {
                id
                url
            }
        }
        createdAt
        updatedAt
    }
`

const storiesInfo = `
    {
        id
        app {
            id
            name
        }
        storyElements {
            id
            name
        }
        storyCategories {
            id
            name
        }
        createdAt
        updatedAt
    }
`

module.exports = {
    appsInfo,
    storiesInfo
}