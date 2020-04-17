import React from "react";
import { Link } from "react-router-dom";
// import Modal from "react-animated-modal";
import Modal from "react-responsive-modal";

const customStyles = {
  overlay: {
    paddingTop: "5%",
    backgroundColor: "rgba(10, 10, 10, 0.75)"
  },
  modal:{
      borderRadius: 16
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
        classNames={{ modal: "card-layout toggle"}}
      >
          <div className="card">
            <div className="card__header">
            <img src="/assets/toolkit/images/logo.svg" />
              <div onClick={this.props.closeModal} className="close">X</div>
            </div>
            <div className="card__body">
              <div className="title">Find real problems solved for millions of people</div>
              <div className="subtitle">UXstories is hand picked collection of top apps on App Store that have the best practises of UX from login to purchasing a product and more.</div>
              <div className="subs-card">
                <div className="sub">
                  <h4 style={{marginBottom:20,color: "white"}}>Pro Plan</h4>
                  <h2 style={{marginBottom:5,color: "white"}}>$50</h2>
                  <p style={{marginBottom:5,color: "white"}}>Yearly Subscription</p>
                  <Link to={{
                    pathname: "/payment",
                    state: { email: this.props.email }
                  }}>
                   <button className="button">Subscribe</button>
                  </Link>
                </div>
                <div className="plan">
                  <p style={{color: "white"}}>200+ stories from top apps</p>
                  <p style={{color: "white"}}>45+ apps</p>
                  <p style={{color: "white"}}>Advanced Search & filtering</p>
                  <p style={{color: "white"}}>Unlimited libraries</p>
                </div>
              </div>
              <div className="stripe">Payments powered by stripe</div>
            </div>
          </div>
        </Modal>
		);
	}
}

export default PickMembershipModal;