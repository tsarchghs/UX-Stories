import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
	render() {
		return (
	        <div className="header back__header">
	          <div className="container">
	            <div className="header__content">
		              <div className="logo">
		                <Link to="/"><img src="/assets/toolkit/images/logo.svg"/></Link>
		              </div>        <div className="nav">
		                <h5 className="light-gray"><a href="#">Apps</a></h5>
		                <Link to="/">
		               		<h5 className="light-gray active">Stories</h5>
		               	</Link>
		                <h5 className="light-gray"><a href="#">Jobs</a></h5>
		              </div>        <div className="profile-nav">
		                <p className="light-gray"><a href="#">About</a></p>
		                <p className="light-gray"><a href="#">Contact</a></p>
		                <p className="light-gray"><a href="#">Upgrade</a></p>
		                <div>
			                <Link to="/profile">
			                	<img className="profile-nav__img" src={this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"} />
		              		</Link>
		              	</div>
		                <p className="light-gray"><a onClick={this.props.user.logout}>Logout</a></p>
		              </div>    
	              </div>
	          </div>
	        </div>
		);
	}
}

export default Header;