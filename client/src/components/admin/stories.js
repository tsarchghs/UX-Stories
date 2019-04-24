import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import gql from "graphql-tag";

class Stories extends React.Component {
	render(){
		return (
			<div>
		        <Header/>
		        <LeftSidebar/>
		        <AdminListPage
		          typename="story"
		          typename_plural="stories"
		          connection_type="storiesConnection"
		          search_by="id_contains"
		          delete_type="deleteStory"
		          mutation_type="createStory"
		          fields={[
		                "id",
		                { 
		                  fetch:"app { id name }",
		                  show:"app",
		                  queryName: "apps",
		                  create_queryName: "app",
		                  query: gql`query { apps { id name } }`
		              	},
		                { 
		                  fetch:"appVersions { id name }",
		                  show:"app versions",
		                  queryName: "appVersions",
		                  query: gql`query { appVersions { id name } }`,
		                  hasMany: true,	
		                  hasManyCreate: true
		                },
						{ 
		                  fetch:"storyCategories { id name }",
		                  show:"story categories",
		                  queryName: "storyCategories",
		                  query: gql`query { storyCategories { id name } }`,
		                  hasMany: true,
		                  hasManyCreate: true
		                },
		                {
		                	fetch:"storyElements { id name }",
		                	show:"story elements",
			                queryName: "storyElements",
			                query: gql`query { storyElements { id name } }`,
			                hasMany: true,
			                hasManyCreate: true
		                },
		                {
		                	type: "video",
		                	show: "Video",
		                	fetch: "video { id file { id url } }",
		                	queryName: "video",
		                	hideTable: true
		                },
		                {
		                	type: "file",
		                	show: "Thumbnail",
		                	fetch: "thumbnail { id url }",
		                	queryName: "thumbnail",
		                	create_queryName: "thumbnail",
		                	hideTable: true
		                },
		                { 
		                  type: "createdBy",
		                  queryName: "createdBy",
		                  fetch: "createdBy { id full_name }",
		                  hideTable: true,
		                  hideCreate: true
		                }
		              ]}
		          first={5}
		        />
	       </div>
		);
	}
}

export default Stories;