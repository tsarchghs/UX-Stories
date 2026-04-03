import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import UpdateObject from "./general/UpdateObject";

class AppCategories extends React.Component {
	render(){
		return (
			<div>
				<Header user={this.props.user}/>
				<LeftSidebar/>
				<AdminListPage 
					typename="app category"
					typename_url_friendly="app_category"
					typename_plural="app categories"
					search_by="name_contains"
					connection_type="appCategoriesConnection"
					delete_type="deleteAppCategory"
					mutation_type="createAppCategory"
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

class UpdateAppCategory extends React.Component {
	render(){
		return (
			<div>
				<Header user={this.props.user}/>
				<LeftSidebar />
				<UpdateObject
					typename="app category"
					location="not_defined_lol"
					mutation_type="updateAppCategory"
					query_type="appCategory"
					object_id={this.props.match.params.id}
					redirect_after_success="/admin/app_categories"
					fields={["id",						
						{
							type: "name",
							fetch: "name",
							show: "Name",
							primitive: "true",
							queryName:"name"
						}
					]}
				/>
			</div>
		)
	}
}

export { AppCategories, UpdateAppCategory};