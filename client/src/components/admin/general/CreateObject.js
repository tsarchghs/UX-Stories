import React from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import { Redirect } from "react-router-dom";
import Loading from "../../loading"
import Alert from "../../alert";
import gql from "graphql-tag";
import { handleUploadPhotoInput } from "../../../helpers";
import $ from "jquery";

const CreateObjectMutation = gql`
	mutation CreateObject(
		$data: JSON_OBJECT_Input!
		$fields: [String!]
		$mutation_type: MUTATION_TYPE!
		$fields_info: JSON_OBJECT_Input!
	) {
		createObject(
			data: $data
			fields: $fields
			mutation_type: $mutation_type
			fields_info: $fields_info
		) {
			repr
		}
	}
`

class CreateObject extends React.Component {
	constructor(props){
		super(props);
		this.refs = {}
	}
	render(){
		return (
			<div className="row">
		              <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
		                <Mutation 
		                	mutation={CreateObjectMutation}>
		               		{ (createObject,{loading,error,data}) => {
		               			console.log(data,4);
		               			if (data) {
		               				return <Redirect to={this.props.location.pathname}/>
		               			}
		               			if (loading) return <center><Loading/></center>
		               			return (
					                <form onSubmit={async (e) => {
					                	e.preventDefault();
					                	let data = Object.keys(this.refs).map(ref_key => {
					                		let node = this.refs[ref_key];
					                		if (node.multiple){
					                			let values = $(node).val();
					                			return JSON.stringify({ [ref_key]: values})
					                		}
					                		if (node.base64){
					                			return JSON.stringify({ [ref_key]: node.base64 })
					                		}
					                		return JSON.stringify({ [ref_key]: node.value })
					                	})
					                	console.log(data);
					                	let repr = JSON.stringify(data);
					                	console.log(1);
					                	let res = await createObject({
					                		variables: {
					                			data: { repr },
					                			mutation_type: this.props.mutation_type,
					                			fields_info: { repr: JSON.stringify(this.props.fields) }
					                		}
					                	})
					                	console.log(res);
					                }}>
						                <div className="row">
						                  <div className="col-md-8">
															<center>
																{
																			error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{height:50}} red={true} message={error} />)
																}
															</center>
						                    <div className="card">
						                      <div className="card-header">
						                        <h4 className="mb-0">Creating new {this.props.typename}</h4>
						                      </div>
						                      <div className="col-md-12 mb-12" style={{marginTop: '30px'}}>
						                      {
						                      	this.props.fields.map(field => {
						                      		if (field.hideCreate || field === "id" || field.type === "id") return;
						                      		console.log(field,typeof(field))
						                      		let show = typeof(field) === "object" ? field.type : field
						                      		if (typeof(field) === "object"){
						                      			if (field.type === "file" || field.type === "video"){
						                      				return (
						                      					<div>
									                              <label htmlFor="firstName">Upload {field.show}</label>
									                              <div style={{marginTop: '10px'}}>
									                                <input 
									                                	onChange={() => handleUploadPhotoInput(this.refs[field.queryName],false)} 
									                                	ref={node => {
									                                		this.refs = Object.assign({},this.refs,{ [field.queryName]: node })}
									                                	}
									                                	type="file" name="pic" accept="image/*" />
									                              </div>
									                            </div>
						                      				);
						                      			}
						                      			if (field.primitive && !field.options){
						                      				console.log(field.type,55);
						                      				return <div>
											                        <label htmlFor="firstName">{field.show}</label>
											                        <input type={"password"} ref={node => this.refs = Object.assign({},this.refs,{ [field.queryName]: node })} type="text" className="form-control" id="firstName" placeholder required />
								                      			</div>
						                      			}
						                      			if (field.options){
						                      				return (
				                      							<div>
				                      								<label htmlFor="firstName">{field.show}</label>
					                      							<select multiple={field.hasMany} ref={node => this.refs = Object.assign({},this.refs,{ [field.queryName]: node })} className="form-control" id="input-select">
					                      								{
					                      									field.options.map(option => {
					                      										return <option id={option.id} value={option.id}>{option}</option>
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
						                      					{ ({loading,data,error}) => {
						                      						console.log(field.query)
						                      						if (loading){
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
						                      						console.log(data,field);
						                      						let objects = data ? data[field.queryName] : []
						                      						console.log(objects)
						                      						return (
						                      							<div>
						                      								<label htmlFor="firstName">{field.show}</label>
							                      							<select multiple={field.hasMany} ref={node => this.refs = Object.assign({},this.refs,{ [field.queryName]: node })}
								                      								className="form-control" id="input-select"
								                      							>
										                      					{
										                      						objects && objects.length ? "" 
										                      						: <option value={undefined}>None</option>
										                      					}
																				{
													                      			objects.map(obj => {
													                      				return <option id={obj.id} value={obj.id}>{obj.name}</option>
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
									                        <input ref={node => this.refs = Object.assign({},this.refs,{ [field.queryName]: node })} type="text" className="form-control" id="firstName" placeholder required />
						                      			</div>
						                      		);
						                      	})
						                      }
						                        <div className="invalid-feedback">
						                          Valid first name is required.
						                        </div>
						                        <hr className="mb-12" />
						                        <button className="btn btn-primary btn-lg btn-block" type="submit" style={{marginBottom: '20px'}}>Create this {this.props.typename}🥳</button>
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
		);		
	}
}

export default CreateObject;