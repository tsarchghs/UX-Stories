import React from "react";

class Alert extends React.Component {
	render(){
		return (
      		<div className={`alert ${this.props.red ? "red" : ""}`}>{this.props.message}</div>
		);
	}
}

export default Alert;