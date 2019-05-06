import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import UpdateObject from "./general/UpdateObject";

class StoryElements extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage 
					typename="story element"
					typename_plural="story elements" 
					typename_url_friendly="story_element"
					connection_type="storyElementsConnection"
					delete_type="deleteStoryElement"
					mutation_type="createStoryElement"
					search_by="name_contains"
					fields={[
						"id",
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

class UpdateStoryElement extends React.Component {
	render() {
		return (
			<div>
				<Header />
				<LeftSidebar />
				<UpdateObject
					typename="story element"
					location="not_defined_lol"
					mutation_type="updateStoryElement"
					query_type="storyElement"
					object_id={this.props.match.params.id}
					redirect_after_success="/admin/story_elements"
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

export { StoryElements, UpdateStoryElement };