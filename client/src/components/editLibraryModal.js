import React from "react";
import { Mutation, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Alert from "./alert";
import ReactDOM from "react-dom";
import Modal from 'react-modal';
import { LIBRARIES_QUERY, EDIT_LIBRARY_MUTATION } from "../Queries";
import Loading from "./loading";

const customStyles = {
  content: {
    top: '370px',
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

class _EditLibraryModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			libraryName: props.name
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
        <div>
            <h3 className="modal__title">Edit library</h3>
            <div id="inside_exampleModal2">
              <Mutation
              mutation={EDIT_LIBRARY_MUTATION}>
                { (editLibrary,{loading,error,data}) => {
                  console.log(data,loading)
                  return (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (loading) return;
                      let res = await editLibrary({
                        variables:{
                          id: this.props.id,
                          name: this.props.name
                        }
                      })
                      let data = res.data;
                      try {
                          let current_libraries = this.props.client.readQuery({ query: LIBRARIES_QUERY });
                          current_libraries.libraries = current_libraries.libraries.map(library => {
                            if (library.id === this.props.id){
                                return data.editLibrary
                            }
                            return library
                          })
                        console.log(JSON.parse(JSON.stringify(current_libraries)))
                        this.props.client.writeQuery({
                            query: LIBRARIES_QUERY,
                            data: JSON.parse(JSON.stringify(current_libraries))
                        })
                      } catch (e) { 
                        console.log(e)
                      }
                      this.props.closeModal()

                    }}>
                <div>
                        {
                          error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
                        }
                      <div>
                          <input value={this.props.name} onChange={this.props.onChange} className="input" type="text" placeholder="Library name" />
                      </div>
                      <div className="text-right">
                      {
                        loading ? <Loading noCenter={true} style={{width: 45,textAlign:"right"}}/>
                        : <button className="button">Save</button>
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
          </div>
        </Modal>
		);
	}
}

export default withApollo(_EditLibraryModal);