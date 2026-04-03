import React from "react";
import { Link, withRouter } from "../lib/routerCompat";
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
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from "../configs";

const getPrefilledEmail = (location) => {
  if (location && location.state && location.state.email) {
    return location.state.email;
  }

  const searchParams = new URLSearchParams(location?.search || "");
  return searchParams.get("email") || "";
};

class _SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jobs: undefined,
			email: getPrefilledEmail(this.props.location),
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
				{ ({loading,error,data:jobsData}) => {
					if (error) return <p>{error.message}</p>
					const jobs = jobsData?.jobs || [];
					const jobsLoading = loading && jobs.length === 0;
					const selectedJobId = this.state.job || jobs[0]?.id;

					return (
						<Mutation
							mutation={SIGN_UP_MUTATION}
						>
						{ (signUp,{loading,error,data}) => {
							if (data && data.signUp.token){
								Cookies.set("token",data.signUp.token);
								let callback = () => this.props.history.push("/payment")
								loading = true; 
								this.props.refetchApp(callback);
							}
							let onSuccessGoogle = ({ accessToken }) => {
								signUp({
									variables: {
										google_accessToken: accessToken,
										password: "DOES_NOT_MATTER"
									}
								})
							}
							let onSuccessFacebook = ({ accessToken }) => {
								signUp({
									variables: {
										facebook_accessToken: accessToken,
										password: "DOES_NOT_MATTER"
									}
								})
							}
							let errors = getGraphqlErrors(error);
							return (
								<form className="login" onSubmit={(e) => {
									e.preventDefault();
									if (!selectedJobId) {
										return;
									}
									signUp({variables:{
										full_name: this.state.full_name,
										email: this.state.email,
										password: this.state.password,
										job: selectedJobId
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
												!jobs.length ? <Alert red={true} message="No jobs available right now. Please try again later." /> :
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
																	value={selectedJobId || ""}
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
																			clientId={GOOGLE_CLIENT_ID}
																			buttonText="Sign-up with google"
																			onSuccess={onSuccessGoogle}
																			onFailure={this.handleGoogleLoginResponse}
																		/>
																		<div style={{marginTop:10}}>
																			<FacebookLogin
																				appId={FACEBOOK_APP_ID}
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
