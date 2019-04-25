import React from "react";
import { Link } from "react-router-dom";
import {loadToolkit} from "../helpers";

class Header extends React.Component {
	componentDidMount(){
		loadToolkit();
	}
	render() {
		let location = window.location.href.split("/");
		let pathname = location[location.length-1]
		return (
	        <div className="header back__header">
	          <div className="container">
	            <div className="header__content">
		              <div className="logo">
		                <Link to="/"><img src="/assets/toolkit/images/logo.svg"/></Link>
		              </div>        <div className="nav">
		              	<Link to="/">
		               		<h5 className={`light-gray ${pathname === "" || pathname === "#" ? "active" : ""}`}>Apps</h5>
		                </Link>
		                <Link to="/stories">
		               		<h5 className={`light-gray ${pathname === "stories" || pathname === "stories#" ? "active" : ""}`}>Stories</h5>
		               	</Link>
		                <h5 className="light-gray"><a href="#">Jobs</a></h5>
		              </div>        <div className="profile-nav">
		                <p className="light-gray"><a href="#">About</a></p>
		                <p className="light-gray"><a href="#">Contact</a></p>
						{        
							!this.props.user ? "" : <p className="light-gray"><a href="#">Upgrade</a></p>
						}
						{
							this.props.user
							? <div ref={node => this.profile_img = node} className="profile-nav__img--content">
						        <div onClick={e => {
						        	if (this.profile_img.className.indexOf("opened") === -1){
						        		this.profile_img.classList.add("opened");
						        	} else {
						        		this.profile_img.classList.remove("opened");
						        	}
						        }} style={{
						        	cursor:"pointer",
						        	backgroundImage: `url("${this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"}")`}} className="profile-nav__img">
								</div>
						        
						        <div className="profile-nav__dropdown">
						          <div className="profile-dropdown__img">
						              <Link to="/profile">
							            <div className="profile-nav__img" 
							            	style={{
							        		backgroundImage: `url("${this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"}")`}} />
						            	</Link>
						            
						            <div className="profile-nav__img--info">
						              <p className="bold">{this.props.user.full_name}</p>
						              <p className="light-gray">{this.props.user.email}</p>
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
						    : <div>
				            		<Link to="/login"><p className="light-gray"><a>Login</a></p></Link>
				            		<Link to="/register"><p className="light-gray"><a>Register</a></p></Link>
				            	</div>
						}
		              </div>    
	              </div>
	          </div>
	        </div>
		);
	}
}

export default Header;