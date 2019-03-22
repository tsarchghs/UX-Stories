import React from "react";

class Loading extends React.Component {
	render() {
		return (
	        <center style={this.props.style}>
	            <img src="/assets/toolkit/images/logo.svg" alt /><br/>
	            <img src="https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif" />
	        </center>
		);
	}
}

export default Loading;