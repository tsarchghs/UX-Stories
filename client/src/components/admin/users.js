import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
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
					search_by="full_name_contains"
					search_by_show="full name"
					first={5}
				/>
		   </div>
		);
	}
}


export default Users