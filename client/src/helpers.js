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
  let list = []
  for (var key in state.filterBy[type]) {
    if (state.filterBy[type][key]){
      list.push(key);
    }
  }
  return list
}

const insertActiveFilters = (filters,state) => {
    for (var type_ in filters){
      for (var obj in state.filterBy[type_]){
          if (state.filterBy[type_][obj]){
            filters[type_].push(obj)
          }
      }
    }
    return filters;
}

export {
	getStories,
	getAppCategories,
	getStoryCategories,
	getStoryElements,
  getActiveFilters,
  insertActiveFilters
}