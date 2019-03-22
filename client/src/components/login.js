import React from "react";

class Login extends React.Component {
	render() {
		return (
			<div>
				<form onSubmit={this.props.login}>
					{this.props.show_message}<br/>
					Email:<input id="email" />
					Password:<input id="password" />
					<button type="submit">Login</button>
				</form>
			</div>
		);
	}
}

export default Login;