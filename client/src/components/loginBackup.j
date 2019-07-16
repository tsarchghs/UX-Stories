import React from "react";
import { Link } from "react-router-dom";
import Alert from "./alert";
import { Mutation } from "react-apollo";
import Cookies from "js-cookie";
import Loading from "./loading";
import { LOGIN_MUTATION, LOGIN_WITH_GOOGLE_MUTATION } from "../Queries";
import GoogleLogin from 'react-google-login';
import { adopt } from 'react-adopt'


const Composed = adopt({
	login: ({ refetchApp, render }) => (
		<Mutation mutation={LOGIN_MUTATION} refetchApp={refetchApp}>{render}</Mutation>
	),
	loginWithGoogle: ({refetchApp,render}) => (
		<Mutation mutation={LOGIN_WITH_GOOGLE_MUTATION} refetchApp={refetchApp}>{render}</Mutation>
	)
})

class Login extends React.Component {
	constructor(props){
		super(props);
		this.email = undefined;
		this.password = undefined;
	}
	render() {
		return (
			<Mutation 
				mutation={LOGIN_MUTATION}>
			{ (login,{loading,error,data}) => {
				let errors = []
				if (error){
					if (error.message === "GraphQL error: Invalid credentials"){
						errors.push("Invalid credentials");
					}
				}
				if (data && data.login.token){
					Cookies.set("token",data.login.token)
					this.props.refetchApp();
				}
				return (
					<form className="login" onSubmit={(e) => {
						e.preventDefault();
						login({variables:{
							email: this.email.value,
							password: this.password.value
						}});
					}}>
				        <div className="login__container">
			          <div className="login__content">
			          	<Link to="/">
			            	<h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="/assets/toolkit/images/backArrow.png" alt />Back</a></h4>
			            </Link>
			            <div className="login__header">
			              <img src="/assets/toolkit/images/logo.svg" alt />
			              <p className="gray">The interesting thing is that everyone sitting on the couch with a bag of popcorn watching these shows are broke. </p>
			            </div>
			            <div className="login__hero">
			              <div className="login__hero--left">
			                <h1 className="bold text-center">Welcome back</h1>
							{
								errors.map(error => <Alert style={{height:"70"}} red={true} message={error}/>)
							}
			                <div className="input__wo-border">
			                  <input ref={node => this.email = node} className="input first fmt" id="email" type="email" placeholder="Email" />
			                  <input ref={node => this.password = node} className="input last fmt" id="password" type="password" placeholder="Password" />
			                  <Link to="/forget_password">
			                  	<p className="login__rm light-gray text-right"><a href="#">Forgot your password</a></p>
			                  </Link>
								{
									loading ? <center><Loading style={{ width: "50%" }} /></center>
										: <div>
											<button className="button full">Login</button>
											<br />
											<center>
												<h5>or</h5>
											</center>
											<center>
												<GoogleLogin
													clientId="1039054242322-stv546o8fp15utap8tv7630rr4h8p9cl.apps.googleusercontent.com"
													buttonText="Sign-in with google&nbsp;&nbsp;&nbsp;&nbsp;"
													onSuccess={() => undefined}
													onFailure={this.handleGoogleLoginResponse}
													cookiePolicy={'single_host_origin'}
												/>
											</center>
										</div>
								}
			                </div>
			              </div>
						  
			              {/* <div className="login__card">
			                <div className="login__card-img"><img src="/assets/toolkit/images/invalid-name.svg" alt /></div>
			                <h3 className="white">Join us and create free acount</h3>
			                <Link to={{
								pathname:"/register",
								state:{
									from: "/login"
								}
							}}><button className="bold button whitest small">Sign up here</button></Link>
			              </div> */}
			            </div>
			          </div>
			        </div>
			      </form>
				)
			}}
			</Mutation>
		);
	}
}

export default Login;