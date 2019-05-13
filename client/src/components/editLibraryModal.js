import React from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Alert from "./alert";
import ReactDOM from "react-dom";

class _EditLibraryModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			libraryName: props.name
		}
	}
	render(){
    return ReactDOM.createPortal(
      <div className="modal reveal" id={`editLibrary_${this.props.id}`} data-reveal>
	        <h3 className="modal__title">Edit library</h3>
	        <div id="inside_exampleModal2">
	          <Mutation
	          	mutation={gql`
	          		mutation EditLibrary(
                          $id: ID!
                          $name:String!
                          $stories: [StoryLinkType!]
                        ){
	          			editLibrary(
                            id: $id
                            name: $name
                            stories: $stories
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
	          	{ (editLibrary,{loading,error,data}) => {
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
	          				let res = await editLibrary({
	          					variables:{
                        id: this.props.id,
                        name: this.state.libraryName
                      }
	          				})
                    console.log(res);
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
                                current_libraries.libraries.map(library => {
                                  if (library.id === this.props.id){
                                      return data.editLibrary
                                  }
                                  return library
                                })
                                this.props.client.writeQuery({
                                    query: LIBRARIES_QUERY,
                                    data: current_libraries
                                })
                            } catch (e) { 
                                console.log(e,1);
                            }

                            // try {
                            //     const GET_LOGGED_IN_USER_QUERY = gql`                                    
                            //             query {
                            //                 getLoggedInUser{
                            //                     id
                            //                     full_name
                            //                     email
                            //                     role
                            //                     job {
                            //                             id
                            //                             name
                            //                     }
                            //                     profile_photo {
                            //                         url
                            //                     }   
                            //                     libraries {
                            //                             id
                            //                             name
                            //                     }
                            //                 }
                            //             }`
                            //     let current_data = this.props.client.readQuery({ query: GET_LOGGED_IN_USER_QUERY});
                            //     let new_library = data.editLibrary;
                            //     current_data.getLoggedInUser.libraries = [
                            //         {
                            //             __typename: "Library",
                            //             id: new_library.id,
                            //             name: new_library.name
                            //         }
                            //     ].concat(current_data.getLoggedInUser.libraries);
                            //     this.props.client.writeQuery({
                            //         query: GET_LOGGED_IN_USER_QUERY,
                            //         data: current_data
                            //     })
                            // } catch (e) {console.log(e,2)}

                                document.getElementById(`editLibrary_${this.props.id}`).parentElement.click()
	          			}}>
							<div>
											{
												error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
											}
					          <div>
												<input value={this.state.libraryName} onChange={e => this.setState({ libraryName: e.target.value })} className="input" type="text" placeholder="Library name" />
					          </div>
					          <div className="text-right">
					            <button className="button">Save</button>
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
        </div>,
        document.body
		);
	}
}

export default withApollo(_EditLibraryModal);