import React from "react";
import { Link, withRouter } from "react-router-dom";
import Loading from "./loading";
import Alert from "./alert";
import { Query, Mutation } from "react-apollo";
import Cookies from "js-cookie";
import {
	JOBS_QUERY,
	SIGN_UP_MUTATION
} from "../Queries"
import GoogleLogin from 'react-google-login';
import { getGraphqlErrors } from "../helpers";
import FacebookLogin from 'react-facebook-login';

class _SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jobs: undefined,
			email: this.props.location.state && this.props.location.state.email ? this.props.location.state.email : "",
			password: undefined,
			job: undefined,
			full_name: undefined,
			password: undefined
		}
		this.handleGoogleLoginResponse = this.handleGoogleLoginResponse.bind(this)
		this.full_name = undefined;
		this.job = undefined;
		this.password = undefined;
		this.focusOnFullNameOnce = false
		this.onChange = this.onChange.bind(this);
	}
	handleGoogleLoginResponse(res){
		console.log(res)
	}
	onChange(e,key){
		this.setState({[key]:e.target.value});
	}
	render() {
		return (
			  <Query 
			  	query={JOBS_QUERY}>
				{ ({loading,error,data}) => {
					if (error) return <p>{error.message}</p>
					let jobs = data.jobs;
					let jobsLoading = loading

					return (
						<Mutation
							mutation={SIGN_UP_MUTATION}
						>
						{ (signUp,{loading,error,data}) => {
							if (data && data.signUp.token){
								Cookies.set("token",data.signUp.token);
								let callback = () => this.props.history.push("/")
								loading = true; 
								this.props.refetchApp(callback);
							}
							let onSuccessGoogle = res => {
								console.log(res.id)
								let basicProfile = res.getBasicProfile();
								signUp({
									variables: {
										full_name: basicProfile.ig,
										email: basicProfile.U3,
										password: "DOES_NOT_MATTER",
										google_accessToken: res.accessToken,
										profile_photo: {
											createWithUrl: {
												url: basicProfile.Paa
											}
										}
									}
								})
							}
							let onSuccessFacebook = data => {
								console.log(data)
								signUp({
									variables: {
										full_name: data.name,
										email: data.email,
										password: "DOES_NOT_MATTER",
										facebook_accessToken: data.accessToken,
										profile_photo: {
											createWithUrl: {
												url: data.picture.data.url
											}
										}
									}
								})
							}
							let errors = getGraphqlErrors(error);
							return (
								<form className="login" onSubmit={(e) => {
									e.preventDefault();
									signUp({variables:{
										full_name: this.state.full_name,
										email: this.state.email,
										password: this.state.password,
										job: this.state.job
									}})
								}}>
							        <div className="login__container">
							          <div className="login__content">
											<Link to={this.props.location.state && this.props.location.state.from ? this.props.location.state.from : "/" }>
							            	<h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="/assets/toolkit/images/backArrow.png" alt />Back</a></h4>
							            </Link>
							            <div className="login__header mb50">
							              <img src="../../assets/toolkit/images/logo.svg" alt />
							              <p className="gray">The interesting thing is that everyone sitting on the couch with a bag of popcorn watching these shows are broke. </p>
							            </div>
							            <div className="login__hero">
							              <div className="login__hero--left">
							                <h1 className="bold text-center">Create your account</h1>
												{
														errors && errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
												}
														
											{
												jobsLoading ? <Loading /> :                  
														<div className="input__wo-border">
																<input 
																	onChange={e => this.onChange(e, "full_name")}
																	value={this.state.full_name}
																	ref={node => {
																		if (node && !this.focusOnFullNameOnce){
																			node.focus();
																			this.focusOnFullNameOnce = true;
																		}
																	}}
																	className="input first fmt"
																	type="text" 
																	placeholder="First and your last name" 
																	required
																/>
																<div className="select__div fmt wo-border">
																<select 
																	onChange={e => this.onChange(e, "job")}
																	value={this.state.job}
																>
																	{
																	jobs.map(job => <option id={job.name} value={job.id}>{job.name}</option>)
																	}
																</select>

															</div>
															<input 
																onChange={e => this.onChange(e,"email")}
																value={this.state.email}
																className="input fmt" 
																type="email" id="r_email" 
																placeholder="Email" 
																required
															/>
															<input 
																onChange={e => this.onChange(e,"password")}
																value={this.state.password}
																className="input last fmt" 
																type="password" 
																placeholder="Password" 
																required
															/>
																<p className="login__rm light-gray text-center">Before going further please sign up.</p>
																<p className="login__rm light-gray text-center">By clicking this button, you agree to our <a className="bold" href="#">Terms, Privacy Policy.</a></p>
															
															{
																loading ? <center><Loading style={{ width: "50%" }} /></center>
																: <div>
																	<button className="button full">Create account</button>
																	<br/>
																	<center>
																		<h5>or</h5>
																	</center>
																	<center>
																		<GoogleLogin
																			clientId="1039054242322-stv546o8fp15utap8tv7630rr4h8p9cl.apps.googleusercontent.com"
																			buttonText="Sign-up with google&nbsp;&nbsp;&nbsp;&nbsp;"
																			onSuccess={onSuccessGoogle}
																			onFailure={this.handleGoogleLoginResponse}
																			cookiePolicy={'single_host_origin'}
																		/>
																		<div style={{marginTop:10}}>
																			<FacebookLogin
																				appId="2450303615182439"
																				autoLoad={true}
																				fields="name,email,picture"
																				onClick={console.log}
																				callback={onSuccessFacebook} 
																			/>
																		</div>
																	</center>
																</div>
															}
															<Link to="/login"><p className="sign-in light-gray text-center">Already using UX-Stories? <a href="#">Sign in here</a></p></Link>
														</div>
											}

							              </div>
							            </div>
							          </div>
							        </div>
						      </form>
							);
						}}
					   </Mutation>
					)
				}}
			</Query>
		);
	}
}

export default withRouter(_SignUp);