import React from "react";
import Modal from 'react-modal';
import { Link } from "react-router-dom";

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

class PickMembershipModal extends React.Component {
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
            <h3 className="modal__title">Yearly membership</h3>
            <div>
            <Link to={{
                pathname: "/payment",
                state: { email: this.props.email }
            }}>
              <button>Continue</button>
            </Link>
            </div>
            <button className="close-button" data-close aria-label="Close reveal" type="button">
              <img src="../../assets/toolkit/images/006-error.svg" onClick={this.props.closeModal} alt />
            </button>
          </div>
        </Modal>
		);
	}
}

export default PickMembershipModal;