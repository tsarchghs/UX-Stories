import React from "react";
import { DELETE_LIBRARY_MUTATION, LIBRARIES_QUERY } from "../Queries";
import { Mutation, withApollo } from "react-apollo";
import Alert from "./alert";
import Loading from "./loading";

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
        let mainEl = document.getElementById(`deleteLibrary_${this.props.id}`);
        if (mainEl){
            mainEl.style.display = this.props.open ? "block" : "none"
        }
        return (
            <div style={{display: this.props.open ? "block" : "none" }} className="modal reveal" id={`deleteLibrary_${this.props.id}`} data-reveal>
                <h3 className="modal__title">Enter {this.props.name} to confirm</h3>
                <div id="inside_exampleModal2">
                    <Mutation
                        mutation={DELETE_LIBRARY_MUTATION}
                    >
                        { (deleteLibrary,{loading,error,data}) => {
                            let onSubmit = async e => {
                                e.preventDefault();
                                console.log(loading,this.confirmation.value,this.props.name);
                                if (loading) return;
                                if (this.confirmation.value !== this.props.name){
                                    this.setState({
                                        error: "Confirmation faield"
                                    })
                                } else {
                                    let res = await deleteLibrary({
                                        variables:{
                                            id: this.props.id
                                        }
                                    })
                                    let currentCache = this.props.client.readQuery({
                                        query: LIBRARIES_QUERY
                                    })
                                    currentCache.libraries = currentCache.libraries.filter(x => x !== this.props.id);
                                    this.props.client.writeQuery({
                                        query: LIBRARIES_QUERY,
                                        data: currentCache
                                    })
                                    {/* document.getElementById(`libraryCard_${this.props.id}`).outerHTML = "" */}
                                    this.props.close();
                                }
                            }
                            return (
                                <form onSubmit={onSubmit}>
                                    <div>
                                        {this.state.error && <Alert message={this.state.error} red={true}/>}
                                        <div>
                                            <input ref={node => this.confirmation = node} className="input" type="text" placeholder="Library name"/>
                                        </div>
                                        <div>
                                        {!loading && <button className="button" style={{ width: '100%' }}>DELETE</button>}
                                        {loading && <Loading style={{width:50}}/>}
                                    </div>
                                </div>
                            </form>
                            )
                        } }
                    </Mutation>
                </div>
                <button className="close-button" data-close="true" aria-label="Close reveal" type="button">
                    <img src="../../assets/toolkit/images/006-error.svg" />
                </button>
            </div>
        )
    }
}

export default withApollo(_DeleteLibraryModal);