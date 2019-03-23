import React from "react";
import { Link } from "react-router-dom";

class Register extends React.Component {
	render() {
		return (
			<div>
				<form onSubmit={this.props.register}>
					{this.props.show_message_register}<br/>
					First Name:<input id="r_first_name" />
					Last Name:<input id="r_last_name" />
					Email:<input id="r_email" />
					Password:<input id="r_password" />
					<button type="submit">Register</button>
					<Link to="/login"><button type="button">Login</button></Link>
				</form>
			</div>
		);
	}
}

export default Register;