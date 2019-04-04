import React from "react";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Alert from "./alert";

//localhost:3000/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3Jnb3RQYXNzd29yZCI6ImNqdHZzaWlkcWV5dzMwYjYwY3c4bndjbTIiLCJpYXQiOjE1NTQzNjg2Mzd9.4ymRHBkFCbh47WgPtkI-PvSi71e7-yT3jwx5KfdV2K4
//localhost:3000/reset/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb3Jnb3RQYXNzd29yZCI6ImNqdHZzaWlkcWV5dzMwYjYwY3c4bndjbTIiLCJpYXQiOjE1NTQzNjk0MjJ9.A4XrjIZpg_Px2W-WrfPNfJctKASqUxw1ULtl20WmMRk
class ResetPassword extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			valid: undefined,
			success: undefined,
			error_message: undefined
		}
		this.resetPassword = this.resetPassword.bind(this);
	}
	async componentDidMount(){
		console.log(this.props.match);
		let data = await this.props.client.mutate({
			mutation: gql`
				mutation {
					verifyForgotPassword(token:"${this.props.match.match.params.token}"){valid}
				}
			`
		})
		this.setState({
			valid: data.data.verifyForgotPassword.valid
		})

	}
	async resetPassword(e){
		e.preventDefault();
		let new_password = document.getElementById("new_password").value;
		let repeat_new_password = document.getElementById("repeat_new_password").value;
		if (!new_password){
			this.setState({
				error_message: "Password can't be empty"
			})
			return;
		}
		if (!(new_password === repeat_new_password)){
			console.log("dsads");
			this.setState({
				error_message:"Password's do not match"
			})
			return;
		}
		let data = await this.props.client.mutate({
			mutation: gql`
				mutation {
					resetPassword(
				    token:"${this.props.match.match.params.token}"
				    new_password:"${new_password}"
				    repeat_new_password:"${repeat_new_password}"
				  ){
					success
				    error
				  }
				}
			`
		})
		console.log(data);
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
						                	<input id="new_password" className="input first fmt" type="text" placeholder="New password" />
						                  	<input id="repeat_new_password" className="input first fmt" type="text" placeholder="Repeat new password" />	
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

export default ResetPassword;