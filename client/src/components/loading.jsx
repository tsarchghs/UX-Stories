import React from "react";

class Loading extends React.Component {
	render() {
		if (this.props.noCenter){
			return (
				<React.Fragment>
					{this.props.show_logo ? <div><img src="/assets/toolkit/images/logo.svg" alt /><br/></div> : ""}
					<img style={this.props.style} src="/assets/gifs/loading.gif" />
				</React.Fragment>
			)
		}
		return (
	        <center>
				{this.props.show_logo ? <div><img src="/assets/toolkit/images/logo.svg" alt /><br /></div> : ""}
				<img style={this.props.style} src="/assets/gifs/loading.gif" />
			</center>
		);
	}
}

export default Loading;