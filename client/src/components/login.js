import React from "react";
import { Link } from "react-router-dom";
import Alert from "./alert";
import { Mutation } from "react-apollo";
import Cookies from "js-cookie";
import Loading from "./loading";
import { LOGIN_MUTATION, LOGIN_WITH_GOOGLE_MUTATION, LOGIN_WITH_FACEBOOK_MUTATION } from "../Queries";
import GoogleLogin from 'react-google-login';
import { adopt } from 'react-adopt'
import { getGraphqlErrors,setInspectLetUser } from "../helpers";
import FacebookLogin from 'react-facebook-login';

const Composed = adopt({
	login: ({ refetchApp, render }) => (
		<Mutation mutation={LOGIN_MUTATION} refetchApp={refetchApp}>{render}</Mutation>
	),
	loginWithGoogle: ({ refetchApp, render }) => (
		<Mutation mutation={LOGIN_WITH_GOOGLE_MUTATION} refetchApp={refetchApp}>{render}</Mutation>
	),
	loginWithFacebook: ({ refetchApp, render }) => (
		<Mutation mutation={LOGIN_WITH_FACEBOOK_MUTATION} refetchApp={refetchApp}>{render}</Mutation>
	)
})

class Login extends React.Component {
	constructor(props){
		super(props);
		this.email = undefined;
		this.password = undefined;
		this.state = {
			email: undefined,
			password: undefined,
			errors: []
		}
		this.focusOnEmailOnce = false;
	}
	loginWithToken(token){
		Cookies.set("token", token)
		this.props.refetchApp();
	}
	render() {
		return (
			<Composed>
			{ ({ login, loginWithGoogle, loginWithFacebook }) => {
				return (
					<form className="login" onSubmit={async e => {
						e.preventDefault();
						try {
							this.setState({errors:[],loading:true})
							let res = await login({variables:{
								email: this.state.email,
								password: this.state.password
							}});
							let { userId } = res.data.login;
							setInspectLetUser({userId,email:userId})
							this.loginWithToken(res.data.login.token)
						} catch (error) {
							if (error.message === "GraphQL error: Invalid credentials") {
								this.setState({errors:["Invalid credentials"]})
							}
							let errors = getGraphqlErrors(error)
							this.setState({ errors, loading:false })
						}
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
								this.state.errors && this.state.errors.map(error => <Alert style={{height:"70"}} red={true} message={error}/>)
							}
										 
			                <div className="input__wo-border">
			                  <input ref={node => {
								  if (node && !this.focusOnEmailOnce) {
									  node.focus();
									  this.focusOnEmailOnce = true;
								  }
							  }} onChange={e => this.setState({email:e.target.value})} value={this.state.email} className="input first fmt" type="email" placeholder="Email" required/>
			                  <input onChange={e => this.setState({password:e.target.value})} value={this.state.password} className="input last fmt" type="password" placeholder="Password" required/>
			                  <Link to="/forget_password">
			                  	<p className="login__rm light-gray text-right"><a href="#">Forgot your password</a></p>
			                  </Link>
								{
									this.state.loading ? <center><Loading style={{ width: "50%" }} /></center>
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
													onSuccess={async ({accessToken}) => {
														try {
															this.setState({loading:true,errors:[]})
															let res = await loginWithGoogle({
																variables:{
																	google_accessToken: accessToken 
																}
															})
															let { userId } = res.data.loginWithGoogle;
															setInspectLetUser({userId,email:userId})
															this.loginWithToken(res.data.loginWithGoogle.token)
														} catch (error) {
															let errors = getGraphqlErrors(error)
															this.setState({errors,loading: false})
														}
													}}
													onFailure={this.handleGoogleLoginResponse}
													cookiePolicy={'single_host_origin'}
												/>
												<div style={{ marginTop: 10 }}>
													<FacebookLogin
														appId="2450303615182439"
														autoLoad={true}
														fields="name,email,picture"
														onClick={console.log}
														autoLoad={false}
														callback={async ({accessToken}) => {
															try {
																this.setState({ loading: true, errors: [] })
																let res = await loginWithFacebook({
																	variables: {
																		facebook_accessToken: accessToken
																	}
																})
																let { userId } = res.data.loginWithFacebook;
																setInspectLetUser({userId,email:userId})
																this.loginWithToken(res.data.loginWithFacebook.token)
															} catch (error) {
																let errors = getGraphqlErrors(error)
																this.setState({ errors, loading: false })
															}
														}}
													/>
												</div>
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
			</Composed>
		);
	}
}

export default Login;