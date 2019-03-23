import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component {
	render() {
		return (
			<div>
				<form onSubmit={this.props.login}>
					{this.props.show_message}<br/>
					Email:<input id="email" />
					Password:<input id="password" />
					<button type="submit">Login</button>
					<Link to="/register"><button type="button">Register</button></Link>
				</form>
			</div>
		);
	}
}

export default Login;