import React from "react";
import { Mutation, withApollo } from "react-apollo";
import Alert from "./alert";
import Modal from 'react-modal';
import { LIBRARIES_QUERY, CREATE_LIBRARY_MUTATION } from "../Queries";
import Loading from "./loading";

const customStyles = {
	content: {
		top: '279px',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: "368px",
		borderRadius: "6px",
		outline: "none"
	},
	overlay: {
		backgroundColor: "rgba(10, 10, 10, 0.75)"
	}
};

Modal.setAppElement('#root')

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
				isOpen={this.props.modalIsOpen}
				onAfterOpen={this.props.afterOpenModal}
				onRequestClose={this.props.closeModal}
				style={customStyles}
				contentLabel="Example Modal"
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
				<img src="../../assets/toolkit/images/006-error.svg" alt />
				</button>
				</Modal>
		);
	}
}

export default withApollo(_CreateLibraryModal);