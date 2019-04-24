import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import gql from "graphql-tag";

class Users extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
				<AdminListPage
					typename="user"
					typename_plural="users"
					connection_type="usersConnection"
					delete_type="deleteUser"
					mutation_type="createUser"
					fields={[
						{
							type: "id",
							fetch: "id",
							queryName: "id",
							show: "#",
							primitive: true
						},
						{
							type: "full_name",
							fetch: "full_name",
							show: "Full Name",
							queryName: "full_name",
							primitive: true
						},
						{
							type: "email",
							fetch: "email",
							show:"Email",
							queryName: "email",
							primitive: true
						},
						{
							type: "password",
							fetch: "password",
							show: "password",
							primitive: true,
							queryName: "password",
							hideTable: true
						},
						{
							fetch:"libraries { id name }",
							show:"libraries",
							queryName: "libraries",
							hideCreate: true
						},
						{
							type: "role",
							fetch: "role",
							show: "Role",
							primitive: true,
							queryName: "role",
							options: ["MEMBER","ADMIN"]
						},
						{
							type: "job",
							show: "Job",
							show_plural: "Jobs",
							fetch: "job { id name }",
							queryName: "jobs",
							create_queryName: "job",
							query: gql`query { jobs { id name } }`
						}
					]}
					search_by="full_name_contains"
					search_by_show="full name"
					first={5}
				/>
		   </div>
		);
	}
}


export default Users