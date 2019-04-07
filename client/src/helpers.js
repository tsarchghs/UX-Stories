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
	return results.data.appCategories;
}

const getAppVersions = async (client) => {
  const results = await client.query({
    query: gql`
      query {
        appVersions{
          id
          name
        }
      }
    `
  })
  return results.data.appVersions;
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

const getQueryParams = function (url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

const loadToolkit = () => {
        let script = document.createElement("script");
        script.src = "/assets/toolkit/scripts/toolkit.js"
        script.async = true;
        document.body.appendChild(script);
  }

export {
	getStories,
	getAppCategories,
	getStoryCategories,
	getStoryElements,
  getActiveFilters,
  insertActiveFilters,
  getQueryParams,
  loadToolkit,
  getAppVersions
}