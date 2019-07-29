import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import gql from "graphql-tag";
import UpdateObject from "./general/UpdateObject";
import {
	APP_QUERY_SHALLOW,
	ADD_ALGOLIA_INDEX_QUERY,
	UPDATE_ALGOLIA_INDEX_QUERY,
	DELETE_ALGOLIA_INDEX_QUERY
} from "../../Queries";
import { algoliaSync } from "./helpers";
import apolloClient from "../../apolloClient"

let fields = [
	"id",
	{
		fetch: "app { id name }",
		show: "app",
		queryName: "apps",
		update_queryName: "app",
		create_queryName: "app",
		query: gql`query { apps { id name } }`
	},
	{
		fetch: "appVersions { id name }",
		show: "app versions",
		queryName: "appVersions",
		query: gql`query { appVersions { id name } }`,
		hasMany: true,
		hasManyCreate: true
	},
	{
		fetch: "storyCategories { id name }",
		show: "story categories",
		queryName: "storyCategories",
		query: gql`query { storyCategories { id name } }`,
		hasMany: true,
		hasManyCreate: true
	},
	{
		fetch: "storyElements { id name }",
		show: "story elements",
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
]

class AdminStories extends React.Component {
	render(){
		return (
			<div>
		        <Header user={this.props.user}/>
		        <LeftSidebar/>
		        <AdminListPage
					typename="story"
					typename_plural="stories"
					typename_url_friendly="story"
					connection_type="storiesConnection"
					search_by="id_contains"
					delete_type="deleteStory"
					mutation_type="createStory"
					deleteObjectFields={["id","app { id }"]}
					afterDelete={async (obj_id,res) => {
						let obj = JSON.parse(res.data.deleteObject.repr)
						algoliaSync(obj.app.id, "apps_index", UPDATE_ALGOLIA_INDEX_QUERY)
						algoliaSync(obj_id, "stories_index", DELETE_ALGOLIA_INDEX_QUERY)
					}}
					afterCreate={async obj_id => {
						let res = await apolloClient.query({
							query: APP_QUERY_SHALLOW,
							variables: {
								contains_story: obj_id
							}
						})
						console.log(res)
						algoliaSync(res.data.app.id, "apps_index", UPDATE_ALGOLIA_INDEX_QUERY)
						algoliaSync(obj_id, "stories_index", ADD_ALGOLIA_INDEX_QUERY)
					}}
					fields={fields}
					first={5}
		        />
	       </div>
		);
	}
}

class UpdateStory extends React.Component {
	render() {
		return (
			<div>
				<Header user={this.props.user}/>
				<LeftSidebar />
				<UpdateObject
					typename="story"
					location="not_defined_lol"
					mutation_type="updateStory"
					query_type="story"
					object_id={this.props.match.params.id}
					redirect_after_success="/admin/stories"
					fields={fields}
					afterSuccess={obj_id => algoliaSync(obj_id, "stories_index", UPDATE_ALGOLIA_INDEX_QUERY)}
				/>
			</div>
		)
	}
}


export { AdminStories, UpdateStory };