import React from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import { Redirect } from "react-router-dom";
import Loading from "../../loading"
import gql from "graphql-tag";

const CreateObjectMutation = gql`
	mutation DeleteJob(
		$delete_type: DELETE_TYPE!
		$fields: [String!]
		$id: ID!
	) {
		deleteJob(
			delete_type: $delete_type
			fields: $fields
			id: $id
		) {
			repr
		}
	}
`

class CreateObject extends React.Component {
	render(){
		return (
			<div className="row">
		              <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
		                <Mutation 
		                	mutation={CreateObjectMutation}>
		               		{ (createAppCategory,{loading,error,data}) => {
		               			console.log(data,4);
		               			if (data) {
		               				return <Redirect to={this.props.location.pathname}/>
		               			}
		               			if (loading) return <center><Loading/></center>
		               			if (error) return <h5>{error.message}</h5>
		               			return (
					                <form onSubmit={async (e) => {
					                	e.preventDefault();
					                	let variables = { name: this.name.value }
					                	let data = await createAppCategory({variables})
					                	console.log(data);
					                }}>
						                <div className="row">
						                  <div className="col-md-8">
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
						                      			if (field.type === "file"){
						                      				return (
						                      					<div>
									                              <label htmlFor="firstName">Upload {field.show}</label>
									                              <div style={{marginTop: '10px'}}>
									                                <input 
									                                	onChange={() => console.log("logo")} 
									                                	ref={node => this.logoRef = node}
									                                	type="file" name="pic" accept="image/*" />
									                              </div>
									                            </div>
						                      				);
						                      			}
						                      			if (field.enum){
						                      				return (
				                      							<div>
				                      								<label htmlFor="firstName">{field.show}</label>
					                      							<select className="form-control" id="input-select">
					                      								{
					                      									field.options.map(option => {
					                      										return <option>{option}</option>
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
						                      						if (loading){
						                      							return (
						                      								<div>
						                      									<label htmlFor="firstName">{field.show}</label>
						                      									<select className="form-control" id="input-select">
						                      										<option>loading {field.show_plural}</option>
						                      									</select>
						                      								</div>
						                      							)
						                      						}
						                      						if (error) return <p>{error.message}</p>
						                      						console.log(data,field);
						                      						let objects = data[field.queryName]
						                      						return (
						                      							<div>
						                      								<label htmlFor="firstName">{field.show}</label>
							                      							<select className="form-control" id="input-select">
										                      					{
										                      						objects.length ? "" 
										                      						: <option>None</option>
										                      					}
																				{
													                      			objects.map(obj => {
													                      				return <option>{obj.name}</option>
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
									                        <input ref={node => this.name = node} type="text" className="form-control" id="firstName" placeholder required />
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