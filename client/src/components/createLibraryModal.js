import React from "react";
import { Mutation, withApollo } from "react-apollo";
import Alert from "./alert";
import Modal from "react-responsive-modal";
import { LIBRARIES_QUERY, CREATE_LIBRARY_MUTATION } from "../Queries";
import Loading from "./loading";
import { toast } from 'react-toastify';

const customStyles = {
	modal: {
		bottom: 'auto',
		width: "368px",
		borderRadius: "6px",
		outline: "none",
		transform: "translate(2%, 154%)  "
	},
	overlay: {
		backgroundColor: "rgba(10, 10, 10, 0.75)"
	}
};

class _CreateLibraryModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			libraryName: ""
		}
	}
	render(){
		return (
			<Modal
				open={this.props.modalIsOpen}
				onClose={this.props.closeModal}
				styles={customStyles}
				type="fadeIn"
				animationDuration={250}
			>	        
				<h3 className="modal__title" style={{marginBottom:25}}>Create New library</h3>
				<div>
				<Mutation
					mutation={CREATE_LIBRARY_MUTATION}>
					{ (createLibrary,{loading,error,data}) => {
						return (
							<form onSubmit={async (e) => {
									e.preventDefault();
									if (loading) return;
									let res = await createLibrary({
										variables:{name:this.state.libraryName}
									})
									let data = res.data;
									try {
										let current_libraries = this.props.client.readQuery({ query: LIBRARIES_QUERY });
										current_libraries.libraries= [data.createLibrary].concat(current_libraries.libraries);
										this.props.client.writeQuery({
											query: LIBRARIES_QUERY,
											data: current_libraries
										})
									} catch (e) { console.log(e) }
									this.setState({libraryName:""})
									this.props.closeModal();
									toast.success("Created library!")
								}}>
								<div>
												{	
													error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
												}
								<div>
													<input value={this.state.libraryName} onChange={e => this.setState({ libraryName: e.target.value })} className="input" type="text" placeholder="Library name" />
								</div>
								<div className="text-right">
								{
									loading ? <Loading noCenter={true} style={{width: 45,textAlign:"right"}}/> :
									<button className="button">Create</button>
								}
								</div>
								</div>
							</form>
						)
					} }
				</Mutation>
				</div>
				<button className="close-button" data-close aria-label="Close reveal" type="button">
				<img onClick={this.props.closeModal} src="../../assets/toolkit/images/006-error.svg" alt />
				</button>
				</Modal>
		);
	}
}

export default withApollo(_CreateLibraryModal);