import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
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
							this.props.user ? "" : <p className="light-gray"><a href="#">Upgrade</a></p>
						}
		                {
		                	this.props.user
		                	?	<div>
					                <Link to="/profile">
					                	<img className="profile-nav__img" src={this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"} />
				              		</Link>
				              		<p className="light-gray"><a onClick={this.props.user.logout}>Logout</a></p>
				              	</div>
				            : 	<div>
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