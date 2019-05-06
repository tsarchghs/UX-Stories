import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import UpdateObject from "./general/UpdateObject";

class StoryCategories extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage
					typename="story category" 
					typename_plural="story categories"
					typename_url_friendly="story_category"
					connection_type="storyCategoriesConnection"
					search_by="name_contains"
					delete_type="deleteStoryCategory"
					mutation_type="createStoryCategory"
					fields={["id",						
						{
							type: "name",
							fetch: "name",
							show: "Name",
							primitive: "true",
							queryName:"name"
						}
					]}
					first={5}
				/>
		   </div>
		);
	}
}

class UpdateStoryCategory extends React.Component {
	render() {
		return (
			<div>
				<Header />
				<LeftSidebar />
				<UpdateObject
					typename="story category"
					location="not_defined_lol"
					mutation_type="updateStoryCategory"
					query_type="storyCategory"
					object_id={this.props.match.params.id}
					redirect_after_success="/admin/story_categories"
					fields={["id",
						{
							type: "name",
							fetch: "name",
							show: "Name",
							primitive: "true",
							queryName: "name"
						}
					]}
				/>
			</div>
		)
	}
}
export { StoryCategories, UpdateStoryCategory };