
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
        stories {
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
            description
            logo {
                id
                url
            }
            appCategory {
                id
                name
            }
        }
        video {
            id
            file {
                id 
                url
            }
        }
        appVersions {
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
        thumbnail {
            id
            url
        }
        createdAt
        updatedAt
    }
`

module.exports = {
    appsInfo,
    storiesInfo
}