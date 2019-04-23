import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";

class StoryElements extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage 
					typename="story element"
					typename_plural="story elements" 
					connection_type="storyElementsConnection"
					delete_type="deleteStoryElement"
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

export default StoryElements;