import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component {
	render() {
		return (
			<form className="login" onSubmit={this.props.login}>
			        <div className="login__container">
			          <div className="login__content">
			          	<Link to="/">
			            	<h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="/assets/toolkit/images/008-delete.svg" alt />Back</a></h4>
			            </Link>
			            <div className="login__header">
			              <img src="/assets/toolkit/images/logo.svg" alt />
			              <p className="gray">The interesting thing is that everyone sitting on the couch with a bag of popcorn watching these shows are broke. </p>
			            </div>
			            <div className="login__hero">
			              <div className="login__hero--left">
			                <h1 className="bold text-center">Welcome back</h1>
			                {this.props.show_message}
			                <div className="input__wo-border">
			                  <input className="input first fmt" id="email" type="email" placeholder="Email" />
			                  <input className="input last fmt" id="password" type="password" placeholder="Password" />
			                  <p className="login__rm light-gray text-right"><a href="#">Forgot your password</a></p>
			                  <button className="button full" type="submit">Log in</button>
			                </div>
			              </div>
			              <div className="login__card">
			                <div className="login__card-img"><img src="/assets/toolkit/images/invalid-name.svg" alt /></div>
			                <h3 className="white">Join us and create free acount</h3>
			                <Link to="/register"><button className="bold button whitest small">Sign up here</button></Link>
			              </div>
			            </div>
			          </div>
			        </div>
			      </form>
		);
	}
}

export default Login;