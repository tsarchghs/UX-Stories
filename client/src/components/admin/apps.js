import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import gql from "graphql-tag";
import UpdateObject from "./general/UpdateObject";
import { 
  ADD_ALGOLIA_INDEX_QUERY,
  UPDATE_ALGOLIA_INDEX_QUERY,
  DELETE_ALGOLIA_INDEX_QUERY 
} from "../../Queries";
import { algoliaSync } from "./helpers";

const fields = [
  {
    type: "id",
    fetch: "id",
    show: "#",
    queryName: "id",
    primitive: true
  },
  {
    type: "file",
    show: "logo",
    fetch: "logo { id url }",
    queryName: "logo",
    create_queryName: "logo",
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
    options: ["IOS", "ANDROID"]
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
    update_queryName:"appCategory",
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
]

class Apps extends React.Component {
  render(){
    return (
      <div>
        <Header user={this.props.user}/>
        <LeftSidebar/>
        <AdminListPage
          typename="app"
          typename_plural="apps"
          typename_url_friendly="app"
          connection_type="appsConnection"
          delete_type="deleteApp"
          mutation_type="createApp"
          search_by="name_contains"
          fields={fields}
          first={5}
          afterDelete={obj_id => algoliaSync(obj_id,"apps_index",DELETE_ALGOLIA_INDEX_QUERY)}
          afterCreate={obj_id => algoliaSync(obj_id, "apps_index", ADD_ALGOLIA_INDEX_QUERY)}
        />
       </div>
    );
  }
}

class UpdateApp extends React.Component {
  render() {
    return (
      <div>
        <Header user={this.props.user}/>
        <LeftSidebar />
        <UpdateObject
          typename="app"
          location="not_defined_lol"
          mutation_type="updateApp"
          query_type="app"
          object_id={this.props.match.params.id}
          redirect_after_success="/admin/apps"
          fields={fields}
          afterSuccess={obj_id => algoliaSync(obj_id, "apps_index", UPDATE_ALGOLIA_INDEX_QUERY)}
        />
      </div>
    )
  }
}

export { Apps, UpdateApp };