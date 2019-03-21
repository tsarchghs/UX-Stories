import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
	render() {
		return (
	        <div className="header back__header">
	          <div className="container">
	            <div className="header__content">
		              <div className="logo">
		                <a href="#"><Link to="/"><img src="/assets/toolkit/images/logo.svg" alt /></Link></a>
		              </div>        <div className="nav">
		                <h5 className="light-gray"><a href="#">Apps</a></h5>
		                <Link to="/">
		               		<h5 className="light-gray active"><a href="#">Stories</a></h5>
		               	</Link>
		                <h5 className="light-gray"><a href="#">Jobs</a></h5>
		              </div>        <div className="profile-nav">
		                <p className="light-gray"><a href="#">About</a></p>
		                <p className="light-gray"><a href="#">Contact</a></p>
		                <p className="light-gray"><a href="#">Upgrade</a></p>
		                <div>
			                <Link to="/profile">
			                	<img className="profile-nav__img" src="https://scontent.fprn1-1.fna.fbcdn.net/v/t1.0-1/p160x160/35988964_1041356179350456_5301902918050381824_n.jpg?_nc_cat=105&_nc_ht=scontent.fprn1-1.fna&oh=2142e132de1a494501a3fc90d51e365c&oe=5D4FB1D7"/>
		              		</Link>
		              	</div>
		              </div>    
	              </div>
	          </div>
	        </div>
		);
	}
}

export default Header;