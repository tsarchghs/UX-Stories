import React from "react";
import { DELETE_LIBRARY_MUTATION, LIBRARIES_QUERY } from "../Queries";
import { Mutation, withApollo } from "react-apollo";
import Alert from "./alert";
import Loading from "./loading";
import Modal from 'react-modal';

const customStyles = {
    overlay: {
        'backgroundColor': 'rgba(10, 10, 10, 0.75)',
        opacity: 1
    },
    content: {
        top: '50%',
        left: '50%',
        right: '70%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

class _DeleteLibraryModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: undefined
        }
    }
    componentWillUnmount(){
        console.log("UNMMMM")
    }
    render(){
        return (
                <Modal
                    isOpen={this.props.modalIsOpen}
                    onRequestClose={this.props.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                        <Mutation
                            mutation={DELETE_LIBRARY_MUTATION}
                        >
                            { (deleteLibrary,{loading,error,data}) => {
                                let onSubmit = async e => {
                                    e.preventDefault();
                                    if (loading) return;
                                    let res = await deleteLibrary({
                                        variables:{
                                            id: this.props.id
                                        }
                                    })
                                    let currentCache = this.props.client.readQuery({
                                        query: LIBRARIES_QUERY
                                    })
                                    console.log(currentCache.libraries.length);
                                    currentCache.libraries = currentCache.libraries.filter(x => x.id !== this.props.id);
                                    console.log(currentCache.libraries.length);
                                    this.props.client.writeQuery({
                                        query: LIBRARIES_QUERY,
                                        data: currentCache
                                    })
                                    this.props.closeModal();
                                }
                                return (
                                    <div>
                                        <div className="modal__header">
                                            <h4>Delete {this.props.name}</h4>
                                            <p className="gray">This will delete {this.props.name}={this.props.id} and cannot be undone</p>
                                        </div>
                                        <div className="modal__footer">
                                            <div className="modal__footer-buttons">
                                                <a onClick={this.props.closeModal} className="button gray" data-close aria-label="Close modal">No I don’t want</a>
                                                <a onClick={onSubmit} style={{ backgroundColor: "#F6534E" }} className="button red">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } }
                        </Mutation>
            </Modal>
        )
    }
}

export default withApollo(_DeleteLibraryModal);