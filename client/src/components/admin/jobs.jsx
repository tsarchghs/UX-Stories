import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import AdminListPage from "./general/AdminListPage";
import UpdateObject from "./general/UpdateObject";

let fields = [
    "id",
    {
        type: "name",
        fetch: "name",
        show: "Name",
        primitive: "true",
        queryName: "name"
    }
]

class Jobs extends React.Component {
    render() {
        return (
            <div>
                <Header user={this.props.user}/>
                <LeftSidebar />
                <AdminListPage
                    typename="job"
                    typename_plural="jobs"
                    typename_url_friendly="job"
                    connection_type="jobsConnection"
                    search_by="name_contains"
                    delete_type="deleteJob"
                    mutation_type="createJob"
                    fields={fields}
                    first={5}
                />
            </div>
        );
    }
}

class UpdateJob extends React.Component {
    render() {
        return (
            <div>
                <Header user={this.props.user}/>
                <LeftSidebar />
                <UpdateObject
                    typename="job"
                    location="not_defined_lol"
                    mutation_type="updateJob"
                    query_type="job"
                    object_id={this.props.match.params.id}
                    redirect_after_success="/admin/jobs"
                    fields={fields}
                />
            </div>
        )
    }
}
export { Jobs, UpdateJob };