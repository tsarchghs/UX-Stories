import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";

class StoryCategories extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage
					typename="story category" 
					typename_plural="story categories"
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


export default StoryCategories;