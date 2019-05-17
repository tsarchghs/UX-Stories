import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";


const searchClient = algoliasearch(
    "VEF3IFWRPG",
    "49819d66e76fc2b6ffb830f6ebd46717"
);

const appsIndexHelper = algoliasearchHelper(searchClient,"apps_index",{
    facets: ["appCategory.name"],
    hitsPerPage: 4
});

const storiesIndexHelper = algoliasearchHelper(searchClient,"stories_index",{
    facets: ["app.appCategory.name","storyCategories.name","storyElements.name"],
    hitsPerPage: 8
})

export {
    searchClient,
    appsIndexHelper,
    storiesIndexHelper
};