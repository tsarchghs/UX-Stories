import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import AdminListPage from "./general/AdminListPage";

class AppCategories extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage 
					typename="app categories" 
					connection_type="appCategoriesConnection"
					fields={["id","name"]}
					first={5}
				/>
		   </div>
		);
	}
}

export default AppCategories;