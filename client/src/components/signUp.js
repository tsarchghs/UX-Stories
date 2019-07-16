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

class _SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jobs: undefined,
			email: this.props.location.state && this.props.location.state.email
		}
		this.handleGoogleLoginResponse = this.handleGoogleLoginResponse.bind(this)
		this.full_name = undefined;
		this.job = undefined;
		this.password = undefined;
		this.focusOnFullNameOnce = false
	}
	handleGoogleLoginResponse(res){
		console.log(res)
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
								console.log(res)
								console.log(res.accessToken)
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
							return (
								<form className="login" onSubmit={(e) => {
									e.preventDefault();
									signUp({variables:{
										full_name: this.full_name.value,
										email: this.state.email,
										password: this.password.value,
										job: this.job.value
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
														error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
												}
														
											{
												jobsLoading ? <Loading /> :                  
														<div className="input__wo-border">
																<input ref={node => {
																	this.full_name = node
																	if (this.full_name && !this.focusOnFullNameOnce){
																		this.full_name.focus()
																		this.focusOnFullNameOnce = true
																	} 
																	
																}} className="input first fmt" id="r_full_name" type="text" placeholder="First and your last name" />
																<div className="select__div fmt wo-border">
																<select ref={node => this.job = node} id="r_job">
																	{
																	jobs.map(job => <option id={job.name} value={job.id}>{job.name}</option>)
																	}
																</select>

															</div>
															<input onChange={e => this.setState({email:e.target.value})} value={this.state.email} className="input fmt" type="email" id="r_email" placeholder="Email" />
															<input ref={node => this.password = node} className="input last fmt" type="password" id="r_password" placeholder="Password" />
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