import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";

class Apps extends React.Component {
  render(){
    return (
      <div>
        <Header/>
        <LeftSidebar/>
        <AdminListPage
          typename="app"
          typename_plural="apps"
          connection_type="appsConnection"
          fields={[
                "id","name",
                "description","platform",
                "company",
                { 
                  type:"appVersions { id name }",
                  show:"app versions",
                  show_foreach:"name"},
                { 
                  type:"appCategory { id name }",
                  show:"app category",
                  show_foreach:"name"
                }
              ]}
          first={5}
        />
       </div>
    );
  }
}

export default Apps;