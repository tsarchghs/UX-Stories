import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Link } from "react-router-dom";
import Table from "./general/Table";
import AdminListPage from "./general/AdminListPage";

class StoryCategories extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage
					typename="story categories" 
					connection_type="storyCategoriesConnection"
					fields={["id","name"]}
					first={5}
				/>
		   </div>
		);
	}
}


export default StoryCategories;