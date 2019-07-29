import {
    LIBRARIES_QUERY_SHALLOW,
    LIBRARIES_QUERY,
    LIBRARY_QUERY
} from "./Queries";

const setTypename = (arr,val) => {
    let new_arr = []
    for (var x in arr){
        arr[x].__typename = val;
        new_arr.push(arr[x])
    }
    return new_arr;
}

const updateShallowLibrariesQueryCache = async (client,action, library, story_id) => {
    try {
        let cache = client.readQuery({
            query: LIBRARIES_QUERY_SHALLOW,
            variables: { libraryFilterInput: { containsStory: story_id } }
        })
        console.log("cache", client);
        if (action === "connect") {
            let new_library = {
                __typename: "Library",
                id: library.id,
                name: library.name
            }
            let exists;
            for (var x in cache.libraries){
                if (cache.libraries[x].id === library.id) {
                    exists = true;
                    break;
                }
            }
            if (!exists){
                cache.libraries.push(new_library);
            }
        } else if (action === "disconnect") {
            cache.libraries = cache.libraries.filter(x => {
                console.log(x.id,library.id)
                return x.id !== library.id
            })
        }
        client.writeQuery({
            query: LIBRARIES_QUERY_SHALLOW,
            variables: { libraryFilterInput: { containsStory: story_id } },
            data: JSON.parse(JSON.stringify({ libraries: [...cache.libraries] }))
        })
    } catch (e) { console.log(e,159214) }
}

const updateLibrariesQueryCache = async (client,action,library,story) => {
    try {
        let cache2 = client.readQuery({
            query: LIBRARIES_QUERY
        })
        console.log("cache2", cache2);
        if (action === "connect") {
            for (var x in cache2.libraries) {
                let lib = cache2.libraries[x];
                if (lib.id === library.id) {
                    let exists;
                    for (var y in lib.stories){
                        if (lib.stories[y].id === story.id){
                            exists = true;
                            break;
                        }
                    }
                    if (exists) return;
                    console.log(story,999)
                    // story.__typename = "Story";
                    // story.app.appCategory.__typename = "AppCategory";
                    // story.video.__typename = "Video";
                    // story.thumbnail.__typename = "Thumbnail"
                    // story.video.file.__typename = "File";
                    // story.appVersions = setTypename(story.appVersions,"AppVersion")
                    // story.storyCategories = setTypename(story.storyCategories,"StoryCategory")
                    // story.storyElements = setTypename(story.storyElements, "StoryElement")


                    lib.stories.push(story)
                    break;
                }
            }
        } else if (action === "disconnect") {
            for (var x in cache2.libraries) {
                let lib = cache2.libraries[x];
                if (lib.id === library.id) {
                    lib.stories = lib.stories.filter(({id}) => id !== story.id)
                    break;
                }
            }
        }
        client.writeQuery({
            query: LIBRARIES_QUERY,
            data: JSON.parse(JSON.stringify({ libraries: [...cache2.libraries] }))
        })
    } catch (e) { console.log(e,919191) }
}

export {
    updateShallowLibrariesQueryCache,
    updateLibrariesQueryCache
}