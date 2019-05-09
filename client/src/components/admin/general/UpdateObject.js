import React from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import { Redirect, withRouter } from "react-router-dom";
import Loading from "../../loading"
import Alert from "../../alert";
import gql from "graphql-tag";
import { handleUploadPhotoInput } from "../../../helpers";
import $ from "jquery";
import { compose } from "recompose";
import { getObjectConnectionQuery } from "../../../Queries";

const UpdateObjectMutation = gql`
	mutation UpdateObject(
        $id: ID!
		$data: JSON_OBJECT_Input!
		$fields: [String!]
		$mutation_type: MUTATION_TYPE!
		$fields_info: JSON_OBJECT_Input!
	) {
		updateObject(
            id: $id
			data: $data
			fields: $fields
			mutation_type: $mutation_type
			fields_info: $fields_info
		) {
			repr
		}
	}
`

const GetObjectQuery = gql`
    query GetObject(
            $id: ID!
            $query_type: QUERY_TYPE!
            $fields: [String!]!
    ) {
        getObject(
            id: $id
            query_type: $query_type
            fields: $fields
        ) {
            repr
        }
    }
`

class UpdateObject extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {

        }
        this.refs = {}
        console.log(this.props.location,123);
        this.allowed_fields = []
        this.props.fields.map(field => field.hideTable ? undefined : this.allowed_fields.push(field));
        this.queryVariables = {
            id: this.props.object_id,
            fields: this.allowed_fields.map(field => field.fetch ? field.fetch : field),
            query_type: this.props.query_type
        }
    }
    handleOnChange(e, fieldQueryName) {
        this.setState({
            [fieldQueryName]: e.target.value
        })
    }
    render() {
        console.log(this.props.object_id,5555);
        return (
            <Query 
                query={GetObjectQuery}
                variables={this.queryVariables}
            >
                { ({loading,error,data}) => {
                    if (loading) return <Loading style={{marginTop:200}}/>;
                    if (error) return <p style={{marginTop:200}}>{error.message}</p>
                    console.log(data,123456765432345);  
                    let object = JSON.parse(data.getObject.repr);
                    return (
                        <div style={{marginTop:200,marginLeft:200}} className="row">
                            <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                                <Mutation
                                    mutation={UpdateObjectMutation}
                                >
                                    {(updateObject, { loading, error, data }) => {
                                        console.log(data, 4);
                                        if (data) {
                                            return <Redirect to={this.props.location.pathname} />
                                        }
                                        return (
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                let data = Object.keys(this.refs).map(ref_key => {
                                                    let node = this.refs[ref_key];
                                                    if (node.multiple) {
                                                        let values = $(node).val();
                                                        return JSON.stringify({ [ref_key]: values })
                                                    }
                                                    if (node.base64) {
                                                        return JSON.stringify({ [ref_key]: node.base64 })
                                                    }
                                                    return JSON.stringify({ [ref_key]: node.value })
                                                })
                                                data = data.concat(Object.keys(this.state).map(key => {
                                                    return JSON.stringify({ [key]: this.state[key] })
                                                }))
                                                console.log(data);
                                                let repr = JSON.stringify(data);
                                                console.log(1,repr);
                                                let res = await updateObject({
                                                    variables: {
                                                        id: this.props.match.params.id,
                                                        data: { repr },
                                                        mutation_type: this.props.mutation_type,
                                                        fields_info: { repr: JSON.stringify(this.props.fields) },
                                                        fields: this.allowed_fields.map(field => field.fetch ? field.fetch : field)
                                                    }
                                                })
                                                try {
                                                    console.log(res,9999);
                                                    this.props.client.writeQuery({
                                                        query:GetObjectQuery,
                                                        variables: this.queryVariables,
                                                        data: { getObject: res.data.updateObject }
                                                    })
                                                } catch (e) { console.log(e) }
                                                try {
                                                    let cache_d = this.props.client.readQuery({
                                                        query: getObjectConnectionQuery,
                                                        variables: this.props.location.state.get_obj_connection_variables
                                                    })
                                                    let cache_d_clone = JSON.stringify(cache_d);
                                                    let nodes_parsed = JSON.parse(cache_d.getObjectConnection.nodes.repr);
                                                    let updated_nodes = nodes_parsed.map(node => {
                                                        if (node.id === this.props.object_id){
                                                            return JSON.parse(res.data.updateObject.repr)
                                                        }
                                                        return node
                                                    })
                                                    cache_d.getObjectConnection.nodes.repr = JSON.stringify(updated_nodes);
                                                    console.log(JSON.parse(cache_d_clone), cache_d_clone === JSON.stringify(cache_d), cache_d,res.data.updateObject);
                                                    this.props.client.writeQuery({
                                                        query: getObjectConnectionQuery,
                                                        variables: this.props.location.state.get_obj_connection_variables,
                                                        data: cache_d
                                                    })
                                                    console.log(this.props.location.state.get_obj_connection_variables);
                                                } catch (e) { console.log(e) }
                                                this.props.history.push(this.props.redirect_after_success)
                                            }}>
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <center>
                                                            {
                                                                error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
                                                            }
                                                        </center>
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <h4 className="mb-0">Update {this.props.typename}</h4>
                                                            </div>
                                                            <div className="col-md-12 mb-12" style={{ marginTop: '30px' }}>
                                                                {
                                                                    this.props.fields.map(field => {
                                                                        if (field.hideCreate || field === "id" || field.type === "id" || field.type === "password") return;
                                                                        console.log(field, typeof (field))
                                                                        let show = typeof (field) === "object" ? field.type : field
                                                                        if (typeof (field) === "object") {
                                                                            if (field.type === "file" || field.type === "video") {
                                                                                return (
                                                                                    <div>
                                                                                        <label htmlFor="firstName">Upload {field.show}</label>
                                                                                        <div style={{ marginTop: '10px' }}>
                                                                                            <input
                                                                                                onChange={() => handleUploadPhotoInput(this.refs[field.queryName], false)}
                                                                                                ref={node => {
                                                                                                    this.refs = Object.assign({}, this.refs, { [field.queryName]: node })
                                                                                                }
                                                                                                }
                                                                                                type="file" name="pic" accept="image/*" />
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                            if (field.primitive && !field.options) {
                                                                                console.log(field.type, 55);
                                                                                return <div>
                                                                                    <label htmlFor="firstName">{field.show}</label>
                                                                                    <input
                                                                                        value={this.state[field.queryName] !== undefined ? this.state[field.queryName] : object[field.queryName]}
                                                                                        onChange={(e) => this.handleOnChange(e, field.queryName)}
                                                                                        type="text" className="form-control" id="firstName" placeholder required
                                                                                    />
                                                                                </div>
                                                                            }
                                                                            if (field.options) {
                                                                                return (
                                                                                    <div>
                                                                                        <label htmlFor="firstName">{field.show}</label>
                                                                                        <select multiple={field.hasMany} ref={node => this.refs = Object.assign({}, this.refs, { [field.queryName]: node })} className="form-control" id="input-select">
                                                                                            {
                                                                                                field.options.map(option => {
                                                                                                    return <option selected={object[field.queryName] === option} id={option.id} value={option.id}>{option}</option>
                                                                                                })
                                                                                            }
                                                                                        </select>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            return (
                                                                                <Query
                                                                                    query={field.query}
                                                                                >
                                                                                    {({ loading, data, error }) => {
                                                                                        console.log(field.query)
                                                                                        if (loading) {
                                                                                            return (
                                                                                                <div>
                                                                                                    <label htmlFor="firstName">{field.show}</label>
                                                                                                    <select multiple={field.hasMany} className="form-control" id="input-select">
                                                                                                        <option>loading {field.show_plural}</option>
                                                                                                    </select>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        if (error) return <p>{error.message}</p>
                                                                                        console.log(data, field);
                                                                                        let objects = data ? data[field.queryName] : []
                                                                                        console.log(objects)
                                                                                        return (
                                                                                            <div>
                                                                                                <label htmlFor="firstName">{field.show}</label>
                                                                                                <select onChange={e => console.log(e.target.value)} multiple={field.hasMany} ref={node => this.refs = Object.assign({}, this.refs, { [field.queryName]: node })}
                                                                                                    className="form-control" id="input-select"
                                                                                                >
                                                                                                    {
                                                                                                        objects && objects.length ? ""
                                                                                                            : <option value={undefined}>None</option>
                                                                                                    }
                                                                                                    {
                                                                                                        objects.map(obj => {
                                                                                                            let key = field.update_queryName ? field.update_queryName : field.queryName;
                                                                                                            let current_objects = object[key];
                                                                                                            let selected = false;
                                                                                                            if (current_objects.length){
                                                                                                                current_objects.map(current_object => {
                                                                                                                    if (current_object.id === obj.id){
                                                                                                                        selected = true
                                                                                                                    }
                                                                                                                })
                                                                                                            } else {
                                                                                                                //readabilty sakes
                                                                                                                var current_object = current_objects;
                                                                                                                selected = current_object.id === obj.id;
                                                                                                            }
                                                                                                            console.log(key,object);
                                                                                                            return (
                                                                                                                <option
                                                                                                                    selected={selected}
                                                                                                                    id={obj.id}
                                                                                                                    value={obj.id}
                                                                                                                >
                                                                                                                    {obj.name}
                                                                                                                </option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                            </div>
                                                                                        )
                                                                                    }}

                                                                                </Query>
                                                                            )
                                                                        }
                                                                        return (
                                                                            <div>
                                                                                <label htmlFor="firstName">{show}</label>
                                                                                <input ref={node => this.refs = Object.assign({}, this.refs, { [field.queryName]: node })} type="text" className="form-control" id="firstName" placeholder required />
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                                <div className="invalid-feedback">
                                                                    Valid first name is required.
                                                            </div>
                                                                <hr className="mb-12" />
                                                                {
                                                                    loading ? <center><Loading style={{ width: 75, height: 75, marginBottom: 15 }} /></center>
                                                                        : <button className="btn btn-primary btn-lg btn-block" type="submit" style={{ marginBottom: '20px' }}>Update this {this.props.typename}🥳</button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        )
                                    }}
                                </Mutation>
                            </div>
                        </div>
                    )
            }}
            </Query>
        )
    }
}

export default compose(withRouter,withApollo)(UpdateObject);