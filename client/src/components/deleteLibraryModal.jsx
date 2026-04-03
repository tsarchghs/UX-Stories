import React from "react";
import { DELETE_LIBRARY_MUTATION, LIBRARIES_QUERY } from "../Queries";
import { Mutation, withApollo } from "react-apollo";
import Alert from "./alert";
import Loading from "./loading";
import Modal from "react-responsive-modal";
import { toast } from 'react-toastify';
import { getGraphqlErrors } from "../helpers";
import gaEvents from "../gaEvents";

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

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

class _DeleteLibraryModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: "",
            verification: ""
        }
    }
    render(){
        return (
                <Modal
                    open={this.props.modalIsOpen}
                    onClose={() => {
                        this.props.closeModal()
                        this.setState({error:"",verification:""})
                    }}
                    type="fadeIn"
                    animationDuration={250}
                    styles={customStyles}
                >
                        <Mutation
                            mutation={DELETE_LIBRARY_MUTATION}
                        >
                            { (deleteLibrary,{loading,error,data}) => {
                                let onSubmit = async e => {
                                    e.preventDefault();
                                    if (loading) return;
                                    if (this.state.verification !== "DELETE"){
                                        this.setState({error:"Verification failed."})
                                        return;
                                    }
                                    await deleteLibrary({
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
                                    gaEvents.deleteLibrary(this.props.gaCategory)
                                    this.props.closeModal(true);
                                    toast.error(`Deleted library ${this.props.name}!`)
                                }
                                let errors = getGraphqlErrors(error) || (this.state.error && [this.state.error])
                                return (
                                    <div>
                                        <h3 className="modal__title">Enter 'DELETE' to delete library {this.props.name}</h3>
                                        <div>
                                            <form onSubmit={onSubmit}>
                                                <div>
                                                    {
                                                        errors && errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
                                                    }
                                                    <div>
                                                        <input 
                                                            value={this.state.verification} 
                                                            onChange={e => this.setState({verification: e.target.value})} 
                                                            className="input" 
                                                            type="text" 
                                                            placeholder="Enter DELETE to verify." 
                                                        />
                                                    </div>
                                                    <div className="text-right">
                                                        {
                                                            loading ? <Loading noCenter={true} style={{ width: 45, textAlign: "right" }} />
                                                                : <button className="button">Delete</button>
                                                        }
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <button className="close-button" data-close aria-label="Close reveal" type="button">
                                            <img onClick={this.props.closeModal} src="../../assets/toolkit/images/006-error.svg" alt />
                                        </button>
                                    </div>
                                )
                            } }
                        </Mutation>
            </Modal>
        )
    }
}

export default withApollo(_DeleteLibraryModal);