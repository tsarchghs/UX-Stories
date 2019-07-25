import ReactGA from "react-ga";

const events = {
    Home: {
        filterCategory: (appCategory) => {
            ReactGA.event({
                category: "AppsPage",
                action: `FilterAppCategory:"${appCategory.name}"`,
                event: `AppCategory:"${appCategory.name}"`,
                label: `User filtered by app category "${appCategory.name}"`
            })
        }
    },
    SingleStory: {
        goToStoryMinus: (type,i,stories_length) => {
            ReactGA.event({
                category: "SingleStory",
                action: `${type}:${i}-${stories_length}`,
                event: `${type}:${i}-${stories_length}`,
                label: `User clicked ${type} on a single story profile.`
            })
        },
        saveRemoveTrack$: (type,story_id,library_name) => {
            ReactGA.event({
                category: "SingleStory",
                action: `${type}FromLibrary`,
                event: `${type}FromLibrary`,
                label: `User ${type.toLowerCase()} story "${story_id}" on library "${library_name}".`
            })
        }
    },
    handleFilterClick: (category,active,obj, type) => {
        let show_type = active ? "Unfiltered" : "Filtered"
        console.log(type,9191)
        ReactGA.event({
            category,
            action: `${show_type}:${type}`,
            event: `${show_type}:${type}"`,
            label: `User ${show_type.toLowerCase()} ${obj}`
        })
    },
    resetFilters: category => {
        ReactGA.event({
            category,
            action: `ResetFilters`,
            event: `ResetFilters"`,
            label: `User clicked on reset filters.`
        })
    },
    toggle: (category,name) => {
        ReactGA.event({
            category,
            action: `ToggleDropDown:${name}`,
            event: `ToggleDropDown:${name}`,
            label: `User toggled dropdown ${name}`
        })
    },
    sponsorClick: () => {
        ReactGA.event({
            category: "SingleStory",
            action: `SponsorClick`,
            event: `SponsorClick`
        })
    },
    unFilter: (category,type, obj) => {
        ReactGA.event({
            category,
            action: `Unfilter:${type}`,
            event: `${type}`,
            label: `User unfiltered ${type} "${obj}"`
        })
    },
    loadMore: category => {
        ReactGA.event({
            category,
            action: "LoadMore",
            event: "LoadMore",
            label: `User clicked load more on ${category}.`
        })
    },
    editProfile: () => {
        ReactGA.event({
            category: "Profile",
            action: "EditProfile",
            event: "EditProfile",
            label: `User updated his profile info.`
        })
    },
    createLibrary: category => {
        ReactGA.event({
            category,
            action: "CreateLibrary",
            event: "CreateLibrary",
            label: `User created library.`
        })
    },
    editLibrary: category => {
        ReactGA.event({
            category,
            action: "EditLibrary",
            event: "EditLibrary",
            label: `User updated library.`
        })
    },
    deleteLibrary: category => {
        ReactGA.event({
            category,
            action: "DeleteLibrary",
            event: "DeleteLibrary",
            label: `User deleted library.`
        })
    }
}

export default events;