import React from "react";
import { Link } from "react-router-dom";
import Alert from "./alert";
import { withApollo } from "react-apollo";
import { FORGET_PASSWORD_MUTATION } from "../Queries";

class _ForgetPassword extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			reset_email: "",
			success: undefined
		}
		this.sendEmail = this.sendEmail.bind(this);
	}
	async sendEmail(e){
		e.preventDefault();
		let data = await this.props.client.mutate({
			mutation: FORGET_PASSWORD_MUTATION,
			variables: { email: this.state.reset_email }
		})
		this.setState({
			success: data.data.forgetPassword.success
		});
	}
	render(){
		return (
	      <div className="login">
	        <div className="login__container">
	          <div className="login__content">
	          <form onSubmit={this.sendEmail}>
		          	<Link to="/login">
		            	<h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="../../assets/toolkit/images/008-delete.svg" alt />Back</a></h4>
		            </Link>
		            <div className="login__header mb50">
		              <img src="../../assets/toolkit/images/logo.svg" alt />
		              <p className="gray">The interesting thing is that everyone sitting on the couch with a bag of popcorn watching these shows are broke. </p>
		            </div>
		            <div className="login__hero">
		              <div className="login__hero--left">
		                <h1 className="bold text-center">Reset your password</h1>
		                {
		                	this.state.success === undefined 
		                	? "" 
		                	: (
		                		this.state.success
		                		? <Alert message={"Password reset sent! We've just emailed you instructions on how to reset your password."}/>
		                		: <Alert red={true} message={"No user found with the specified email. Please make sure for any typo!"}/>		 
		                	  )
		                }			
						<div className="input__wo-border">
		                  <input onChange={(e) => this.setState({reset_email: e.target.value })} className="input first fmt" type="text" placeholder="Email" />
		                  <p className="login__rm light-gray text-center">By clicking this button, you agree to our <a className="bold" href="#">Terms, Privacy Policy.</a></p>
		                  <button className="button full">Reset password</button>
			          		<Link to="/login">
			                  <p className="sign-in light-gray text-center">Return to <a href="#">Sign in here</a></p>
							</Link>
		                </div>
		              </div>
		            </div>
	            </form>
	          </div>
	        </div>
	      </div>
		);
	}
}

export default withApollo(_ForgetPassword);