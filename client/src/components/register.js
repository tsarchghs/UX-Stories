import React from "react";
import { Link } from "react-router-dom";
import Loading from "./loading";
import gql from "graphql-tag";
import Alert from "./alert";

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			jobs: undefined
		}
	}
	async componentDidMount(){
		let jobs = await this.props.client.query({
			query: gql`
				query {
					jobs {
						id
						name
					}
				}
			`
		})
		this.setState({
			jobs:jobs.data.jobs
		})
	}
	render() {
		console.log(this.props.show_messages_register)
		return (
	      <form className="login" onSubmit={this.props.register}>
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
	                	this.props.show_messages_register.length ? this.props.show_messages_register.map(message => {
	                		return (
	                			<Alert red={true} message={message}/>
	                		)
	                	}) : ""
	                }
						{	
							!this.state.jobs ? <Loading /> :                  
							<div className="input__wo-border">
				                  <input className="input first fmt" id="r_full_name" type="text" placeholder="First and your last name" />
				                  <div className="select__div fmt wo-border">
				                    <select id="r_job">
				                      {
				                      	this.state.jobs.map(job => <option id={job.name} value={job.id}>{job.name}</option>)
					                  }
				                    </select>

			                  </div>
			                  <input className="input fmt" type="email" id="r_email" placeholder="Email" />
			                  <input className="input last fmt" type="password" id="r_password" placeholder="Password" />
			                  <p className="login__rm light-gray text-center">By clicking this button, you agree to our <a className="bold" href="#">Terms, Privacy Policy.</a></p>
			                  <button className="button full">Create account</button>
			   
			                  <Link to="/login"><p className="sign-in light-gray text-center">Already using UX-Stories? <a href="#">Sign in here</a></p></Link>
			                </div>
		            	}
	              </div>
	            </div>
	          </div>
	        </div>
	      </form>
		);
	}
}

export default Register;