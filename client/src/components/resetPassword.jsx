import React from "react";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Alert from "./alert";
import { withApollo } from "react-apollo";
import { withRouter } from "../lib/routerCompat";
import {
	RESET_PASSWORD_MUTATION,
	VERIFY_FORGOT_PASSWORD_MUTATION
} from "../Queries";

class _ResetPassword extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			valid: undefined,
			success: undefined,
			error_message: undefined,
			new_password: "",
			repeat_new_passwod: ""
		}
		this.resetPassword = this.resetPassword.bind(this);
	}
	async componentDidMount(){
		let data = await this.props.client.mutate({
			mutation: VERIFY_FORGOT_PASSWORD_MUTATION,
			variables: {
				token: this.props.match.params.token
			}
		})
		this.setState({
			valid: data.data.verifyForgotPassword.valid
		})

	}
	async resetPassword(e){
		e.preventDefault();
		let new_password = this.state.new_password
		let repeat_new_password = this.state.repeat_new_passwod
		if (!new_password){
			this.setState({
				error_message: "Password can't be empty"
			})
			return;
		}
		if (!(new_password === repeat_new_password)){
			this.setState({
				error_message:"Password's do not match"
			})
			return;
		}
		let data = await this.props.client.mutate({
			mutation: RESET_PASSWORD_MUTATION,
			variables: {
				token: this.props.match.params.token,
				new_password,
				repeat_new_password
			}
		})
		if (!data.data.resetPassword.error){
			this.setState({
				success: true,
				error_message: undefined
			}, ()=> console.log(this.state));
		} else {
			this.setState({
				error_message:data.data.resetPassword.error
			})
		}
	}
	render(){
		return (
	      <div className="login">
	        <div className="login__container">
	          <div className="login__content">
	          <form onSubmit={this.resetPassword}>
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
						{	this.state.valid === undefined
							? <center><img src="https://thumbs.gfycat.com/PeriodicFluidKodiakbear-small.gif"/></center>
			                : (
			                	this.state.valid 
			                	? (
									<div className="input__wo-border">
									{
			                			this.state.error_message 
			                			? <div>
			                				<Alert red={true} message={this.state.error_message}/>
			                			  </div>
			                			: ""
			                		}
			                		{
			                			this.state.success
			                			? <Alert message={"Password reset"}/> 
			                			: ""
			                		}
			                		{
			                			!this.state.success 
						                ? <div>
											<input 
												onChange={(e) => this.setState({new_password: e.target.value})} 
												value={this.state.new_password}
												className="input first fmt" type="text" 
												placeholder="New password" 	
											/>
											<input 
												onChange={(e) => this.setState({repeat_new_passwod: e.target.value})} 
												value={this.state.repeat_new_passwod}
												className="input first fmt" type="text" 
												placeholder="Repeat new password" 	
											/>	
											<p className="login__rm light-gray text-center">By clicking this button, you agree to our <a className="bold" href="#">Terms, Privacy Policy.</a></p>
											<button type="submit" className="button full">Reset password</button>
											<Link to="/login">
												<p className="sign-in light-gray text-center">Return to <a href="#">Sign in here</a></p>
											</Link>
			                			  </div>
			                			: <div>
			                				<Link to="/login">
			                					<button type="submit" className="button full">Back to login</button>
			                				</Link>
			                			  </div>
			                		}
					                </div>
			                	)
			                	: <Alert red={true} message={"Link invalid or expired"}/>
			                )	
			            }
			              </div>
			            </div>

	            </form>
	          </div>
	        </div>
	      </div>
		);
	}
}

export default withRouter(withApollo(_ResetPassword));
