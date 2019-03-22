import React from "react";
import { Link } from "react-router-dom";

class LibraryHeader extends React.Component {
	render() {
		return (
			<div className="header back__header">
	          <div className="container">
	            <div className="header__content">
	              <div className="logo">
	                <a href="#"><img src="/assets/toolkit/images/logo.svg" alt /></a>
	              </div>				
	              <Link to="/profile"><h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="../../assets/toolkit/images/008-delete.svg" alt />Back to profile</a></h4></Link>
	              <div className="profile-nav">
	                <p className="light-gray"><a href="#">Upgrade</a></p>
			                <Link to="/profile">
			                	<img className="profile-nav__img" src={this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"} alt />
		              		</Link>	              
		              		</div>
	            </div>
	          </div>
	        </div>
		);
	}
}

export default LibraryHeader;