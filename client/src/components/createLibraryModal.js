import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Alert from "./alert";
	            // <img src="https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif" />
class CreateLibraryModal extends React.Component {
	constructor(props) {
		super(props);
		this.libraryName = undefined;
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
	          		if (data) {
	          			this.props.closeAndUpdate();
	          		}
	          		return (
	          			<form onSubmit={(e) => {
	          				e.preventDefault();
	          				createLibrary({
	          					variables:{name:this.libraryName.value}
	          				})
	          			}}>
							<div>
											{
												error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
											}
					          <div>
					            <input ref={node => this.libraryName = node} className="input" type="text" placeholder="Library name" />
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

export default CreateLibraryModal;