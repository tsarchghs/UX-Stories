import gql from "graphql-tag";

const getStories = async (client) => {
	const results = await client.query({
      query: gql`
        query {
          stories {
            id
            thumbnail {
              url
            }
          }
        }
      `
    })
    return results.data.stories;
}

const getAppCategories = async (client) => {
	const results = await client.query({
	      query: gql`
	        query {
	          appCategories{
	            id
	            name
	          }
	        }
	      `
	    })
	console.log(results.data.appCategories,111);
	return results.data.appCategories;
}

const getStoryCategories = async (client) => {
	const results = await await client.query({
      query: gql`
        query {
          storyCategories {
            id
            name
          }
        }
        `
    })
    return results.data.storyCategories;
}

const getStoryElements = async (client) => {
	const results = await client.query({
      query: gql`
        query {
          storyElements {
            id
            name
          }
        }
      `
    })
    return results.data.storyElements;
}

const getActiveFilters = (state,type) => {
  if (type === "storyCategories"){
    var storyCategories = [];
    for (var key in state.filterBy.storyCategories) {
      if (state.filterBy.storyCategories[key]){
        storyCategories.push(key);
      }
    }
    return storyCategories
  } else if (type === "elements") {
    var elements = [];
    for (var key in state.filterBy.storyElements) {
      if (state.filterBy.storyElements[key]){
        elements.push(key);
      }
    }
    return elements
  }
}

export {
	getStories,
	getAppCategories,
	getStoryCategories,
	getStoryElements,
  getActiveFilters
}