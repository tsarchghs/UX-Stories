import React from "react";
import { Link } from "react-router-dom";
// import Modal from "react-animated-modal";
import Modal from "react-responsive-modal";

const customStyles = {
  overlay: {
    paddingTop: "25%",
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
        open={this.props.modalIsOpen}
        onClose={this.props.closeModal}
        contentLabel="Example Modal"
        type="fadeIn"
        styles={customStyles}
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