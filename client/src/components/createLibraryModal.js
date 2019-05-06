import React from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Alert from "./alert";

class _CreateLibraryModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			libraryName: ""
		}
	}
	render(){
		return (
	      <div className="modal reveal" id={this.props.id} data-reveal>
	        <h3 className="modal__title">Create New library</h3>
	        <div id="inside_exampleModal2">
	          <Mutation
	          	mutation={gql`
	          		mutation CreateLibrary($name:String!){
	          			createLibrary(
	          				name: $name
	          			) {
											id
											name
											stories {
												thumbnail {
												url
											}
										}
									}
	          		}
	          `}>
	          	{ (createLibrary,{loading,error,data}) => {
	          		if (loading) {
	          			return (
		          			<center>
		          				<img src="https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif" />
		          			</center>
	          			)
	          		}
	          		return (
	          			<form onSubmit={async (e) => {
	          				e.preventDefault();
	          				let res = await createLibrary({
	          					variables:{name:this.state.libraryName}
	          				})
										let data = res.data;
										try {
											const LIBRARIES_QUERY = gql`query {
											libraries {
													id
                          name
                          stories {
														thumbnail {
														url
													}
												}
                      }
										}`
											let current_libraries = this.props.client.readQuery({ query: LIBRARIES_QUERY });
											current_libraries.libraries.push(data.createLibrary);
											this.props.client.writeQuery({
												query: LIBRARIES_QUERY,
												data: current_libraries
											})
										} catch (e) { 
											console.log(e,1);
										}

										try {
											const GET_LOGGED_IN_USER_QUERY = gql`                                    
													query {
														getLoggedInUser{
															id
															full_name
															email
															role
															job {
																	id
																	name
															}
															profile_photo {
																url
															}   
															libraries {
																	id
																	name
															}
														}
													}`
											let current_data = this.props.client.readQuery({ query: GET_LOGGED_IN_USER_QUERY});
											let new_library = data.createLibrary;
											current_data.getLoggedInUser.libraries.push({
												__typename: "Library",
												id: new_library.id,
												name: new_library.name
											})
											this.props.client.writeQuery({
												query: GET_LOGGED_IN_USER_QUERY,
												data: current_data
											})
										} catch (e) {console.log(e,2)}

										this.props.close();
	          			}}>
							<div>
											{
												error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
											}
					          <div>
												<input value={this.state.libraryName} onChange={e => this.setState({ libraryName: e.target.value })} className="input" type="text" placeholder="Library name" />
					          </div>
					          <div className="text-right">
					            <button className="button" id="createLibraryButton">Create</button>
					          </div>
					        </div>
					    </form>
	          		)
	          	} }
	          </Mutation>
	        </div>
	        <button className="close-button" data-close aria-label="Close reveal" type="button">
	          <img src="../../assets/toolkit/images/006-error.svg" alt />
	        </button>
	      </div>
		);
	}
}

export default withApollo(_CreateLibraryModal);