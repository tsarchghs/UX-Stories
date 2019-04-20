import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";

class AppCategories extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage 
					typename="app category" 
					typename_plural="app categories"
					search_by="name_contains"
					connection_type="appCategoriesConnection"
					delete_type="deleteAppCategory"
					fields={["id","name"]}
					first={5}
				/>
		   </div>
		);
	}
}

export default AppCategories;