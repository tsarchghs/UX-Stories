import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";
import AdminListPage from "./general/AdminListPage";

class Users extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage
					typename="users"
					connection_type="usersConnection"
					fields={["id","full_name","email"]}
					first={5}
				/>
		   </div>
		);
	}
}


export default Users