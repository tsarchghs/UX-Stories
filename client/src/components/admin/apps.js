import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import gql from "graphql-tag";

class Apps extends React.Component {
  componentDidMount(){
    console.log("MOUNTED")
  }
  componentWillUpdate(){
    console.log("UPDATED");
  }
  componentWillMount(){
    console.log("UNMOUNTED");
  }
  render(){
    return (
      <div>
        <Header/>
        <LeftSidebar/>
        <AdminListPage
          typename="app"
          typename_plural="apps"
          connection_type="appsConnection"
          delete_type="deleteApp"
          mutation_type="createApp"
          search_by="name_contains"
          fields={[
                {
                  type: "id",
                  fetch: "id",
                  show: "#",
                  primitive: true
                },
                {
                  type:"file",
                  show:"logo",
                  queryName:"logo",
                  create_queryName:"logo",
                  hideTable: true
                },
                {
                  type: "name",
                  show: "name",
                  queryName: "name",
                  primitive: true,
                  fetch: "name"
                },
                {
                  type: "description",
                  show: "description",
                  primitive: true,
                  queryName: "description",
                  fetch: "description",
                },
                {
                  type: "platform",
                  show: "platform",
                  primitive: true,
                  queryName: "platform",
                  fetch: "platform",
                  options: ["IOS","ANDROID"]
                },
                {
                  type: "company",
                  show: "company",
                  primitive: true,
                  queryName: "company",
                  fetch: "company",
                },
                { 
                  type: "appVersion",
                  queryName: "appVersions",
                  query: gql`query { appVersions { id name }}`,
                  fetch: "appVersions { id name }",
                  show: "app version",
                  show_plural: "app versions",
                  hasMany: true,
                  hasManyCreate: true
                },
                { 
                  type: "appCategory",
                  queryName: "appCategories",
                  create_queryName: "appCategory",
                  query: gql`query { appCategories { id name }}`,
                  fetch: "appCategory { id name }",
                  show: "app category",
                  show_plural: "app categories"
                },
                { 
                  type: "createdBy",
                  queryName: "createdBy",
                  fetch: "createdBy { id full_name }",
                  hideTable: true,
                  hideCreate: true
                }
              ]}
          first={5}
        />
       </div>
    );
  }
}

export default Apps;