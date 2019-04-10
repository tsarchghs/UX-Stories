import React from "react";
import { Link } from "react-router-dom";
import {loadToolkit} from "../helpers";

class LibraryHeader extends React.Component {
	componentDidMount(){
		loadToolkit();
	}
	render() {
		return (
			<div className="header back__header">
	          <div className="container">
	            <div className="header__content">
	              <div className="logo">
	                <a href="#"><img src="/assets/toolkit/images/logo.svg" alt /></a>
	              </div>				
	              <Link to="/profile"><h4 className="pink bold header__back"><a href="#" className="flex ac"><img src="../../assets/toolkit/images/008-delete.svg" alt />Back to profile</a></h4></Link>
<div className="profile-nav__img--content">
						        <a href="#" className="profile-nav__img" 
						        	style={{
						        		backgroundImage: `url("${this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"}")`}} />
						        
						        <div className="profile-nav__dropdown">
						          <div className="profile-dropdown__img">
						              <Link to="/profile">
							            <div href="#" className="profile-nav__img" 
							            	style={{
							        		backgroundImage: `url("${this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"}")`}} />
						            	</Link>
						            
						            <div className="profile-nav__img--info">
						              <p className="bold">{this.props.user.first_name} {this.props.user.last_name}</p>
						              <p className="light-gray">{this.props.user.first_name}</p>
						              <Link to="/profile">
						              	<button className="button">Edit profile</button>
						              </Link>
						            </div>
						          </div>
						          <hr />
						          <div className="profile-nav__dropdown--list">
						            <p className="bold"><a href="#">Upgrade to PRO 🚀</a></p>
						            <p className="bold"><a href="#">Become Contributor</a></p>
						            <hr />
						            <p className="bold"><a href="#">About</a></p>
						            <p className="bold"><a href="#">Twitter</a></p>
						            <hr />
						            <p onClick={this.props.user.logout} className="bold"><a href="#">Logout</a></p>
						          </div>
						        </div>
						      </div>
	            </div>
	          </div>
	        </div>
		);
	}
}

export default LibraryHeader;