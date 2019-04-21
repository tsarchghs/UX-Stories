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
          search_by="name_contains"
          fields={[
                {
                  type: "id",
                  fetch: "id"
                },
                {
                  type:"file",
                  show:"logo",
                  hideTable: true
                },
                "name",
                "description","platform",
                {
                  type: "company",
                  show: "company",
                  enum: true,
                  fetch: "company",
                  options: ["IOS","ANDROID"]  
                },
                { 
                  type: "appVersion",
                  queryName: "appVersions",
                  query: gql`query { appVersions { id name }}`,
                  fetch: "appVersions { id name }",
                  show: "app version",
                  show_plural: "app versions",
                },
                { 
                  type: "appCategory",
                  queryName: "appCategories",
                  query: gql`query { appCategories { id name }}`,
                  fetch: "appCategory { id name }",
                  show: "app category",
                  show_plural: "app categories"
                }
              ]}
          first={5}
        />
       </div>
    );
  }
}

export default Apps;