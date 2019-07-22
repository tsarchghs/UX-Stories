import gql from "graphql-tag";
import { toast } from 'react-toastify';

const if_user_call_func = (user,func,setState) => {
  console.log(user);  
  if (user && user.subscription && user.subscription.status) func()
  else setState({ currentModal:"PickMembershipModal"})
}

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

const getAppVersions = async (client,app="") => {
  // if app argument is empty query will return all
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

const getStoryCategories = async (client,app="") => {
  // if app argument is empty query will return all
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

const insertActiveFilters = (filters,state,split) => {
    for (var type_ in filters){
      for (var obj in state.filterBy[type_]){
          if (state.filterBy[type_][obj]){
            if (split){
              obj = obj.split("_")[0]
            }
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

const loadJs = (path) => {
    let script = document.createElement("script");
    script.src = path
    script.async = true;
    document.body.appendChild(script)
}

const handleUploadPhotoInput = (element,isProfile=true) => {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    element.base64 = reader.result
    console.log(reader.result);
    if (isProfile){ // shitty solution but things evolve
      document.getElementById("profile_image").src = reader.result
      document.getElementById("profile_image").changed = true;
    }
  }
  try {
    reader.readAsDataURL(file);
  } catch(e) {
    console.log("Failed to get dataurl");
  }
}

const getGraphqlErrors = (error) => {
  return error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors
}

const onAlgoliaError = (indexHelpers,setState,obj) => {
  console.log(indexHelpers,setState)
  indexHelpers.on("error", e => {
    setState(obj)
    toast.error("Something unexcpected happened, please check your internet connection.",{
      toastId: "ProbablyInternetError"
    })
  })
}

export {
	getStories,
  handleUploadPhotoInput,
	getAppCategories,
	getStoryCategories,
	getStoryElements,
  getActiveFilters,
  insertActiveFilters,
  getQueryParams,
  loadToolkit,
  loadJs,
  getAppVersions,
  if_user_call_func,
  getGraphqlErrors,
  onAlgoliaError
}