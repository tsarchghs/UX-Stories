import React from "react";

class Loading extends React.Component {
	render() {
		return (
	        <center style={this.props.style}>
	            {this.props.show_logo ? <div><img src="/assets/toolkit/images/logo.svg" alt /><br/></div> : ""}
	            <img style={this.props.style} src="https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif" />
	        </center>
		);
	}
}

export default Loading;