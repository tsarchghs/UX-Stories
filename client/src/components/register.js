import React from "react";
import { Link } from "react-router-dom";
import Loading from "./loading";
import gql from "graphql-tag";
import Alert from "./alert";
import { Query, Mutation } from "react-apollo";
import Cookies from "js-cookie";

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jobs: undefined
		}
		this.full_name = undefined;
		this.job = undefined;
		this.password = undefined;
		this.email = undefined;
	}
	render() {
		console.log(this.props.show_messages_register)
		return (
			  <Query 
			  	query={gql`
					query {
						jobs {
							id
							name
						}
					}
				`
			}>
				{ ({loading,error,data}) => {
					if (error) return <p>{error.message}</p>
					let jobs = data.jobs;
					let jobsLoading = loading

					return (
						<Mutation
							mutation={gql`
								mutation SignUp(
									$full_name: String!, $email: String!, 
									$password: String!,$job: ID!
								) {
									signUp(
										full_name: $full_name,
										email: $email,
										password: $password,
										job: $job
									) {
										token
									}
								} 
							`}
						>
						{ (signUp,{loading,error,data}) => {
							let errors = []
							if (error){
								if (error.message === "GraphQL error: Please check that all of your arguments are not empty!"){
									errors.push("Please fill out all the fields");
								} else if (error.message === "GraphQL error: A unique constraint would be violated on User. Details: Field name = email"){
									errors.push("Email is already taken");
								} else {
									return <p>{error.message}</p>
								}

							}
							console.log(data);
							if (data && data.signUp.token){
								Cookies.set("token",data.signUp.token);
								this.props.refetchApp();
							}
							return (
								<form className="login" onSubmit={(e) => {
									e.preventDefault();
									signUp({variables:{
										full_name: this.full_name.value,
										email: this.email.value,
										password: this.password.value,
										job: this.job.value
									}})
								}}>
							        <div className="login__container">
							          <div className="login__content">
							          	<Link to="/login">
							            	<h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="../../assets/toolkit/images/008-delete.svg" alt />Back</a></h4>
							            </Link>
							            <div className="login__header mb50">
							              <img src="../../assets/toolkit/images/logo.svg" alt />
							              <p className="gray">The interesting thing is that everyone sitting on the couch with a bag of popcorn watching these shows are broke. </p>
							            </div>
							            <div className="login__hero">
							              <div className="login__hero--left">
							                <h1 className="bold text-center">Create your account</h1>
							                {
							                	errors.map(error => <Alert style={{height:"70"}} red={true} message={error}/>)
							                }
							                {
							                	loading ? <Loading />
							                	: (
														jobsLoading ? <Loading /> :                  
														<div className="input__wo-border">
											                  <input ref={node => this.full_name = node} className="input first fmt" id="r_full_name" type="text" placeholder="First and your last name" />
											                  <div className="select__div fmt wo-border">
											                    <select ref={node => this.job = node} id="r_job">
											                      {
											                      	jobs.map(job => <option id={job.name} value={job.id}>{job.name}</option>)
												                  }
											                    </select>

										                  </div>
										                  <input ref={node => this.email = node} className="input fmt" type="email" id="r_email" placeholder="Email" />
										                  <input ref={node => this.password = node} className="input last fmt" type="password" id="r_password" placeholder="Password" />
										                  <p className="login__rm light-gray text-center">By clicking this button, you agree to our <a className="bold" href="#">Terms, Privacy Policy.</a></p>
										                  <button className="button full">Create account</button>
										   
										                  <Link to="/login"><p className="sign-in light-gray text-center">Already using UX-Stories? <a href="#">Sign in here</a></p></Link>
										                </div>
									            )

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

export default Register;