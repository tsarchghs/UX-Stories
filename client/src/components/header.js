import React from "react";
import { Link } from "react-router-dom";
import DropdownWrapper from "./wrappers/dropdownWrapper";
import Offline from "./OnlineDetector/Offline";

class Header extends React.Component {
	constructor(props){
		super(props)
		this.profile_img = React.createRef()
	}
	render() {
		let location = window.location.href.split("/");
		let pathname = location[location.length-1]
		return (
	        <div className="header back__header">
			<Offline>You are offline.</Offline>
	          <div className="container">
	            <div className="header__content">
		              <div className="logo">
		                <Link to="/"><img src="/assets/toolkit/images/logo.svg"/></Link>
		              </div>        <div className="nav">
		               		<h5 className={`light-gray ${pathname === "" || pathname === "#" ? "active" : ""}`}><Link to="/">Apps</Link></h5>
		               		<h5 className={`light-gray ${pathname === "stories" || pathname === "stories#" ? "active" : ""}`}><Link to="/stories">Stories</Link></h5>
		                <h5 className="light-gray"><a href="#">Jobs</a></h5>
		              </div>        <div className="profile-nav">
		                <p className="light-gray"><a href="#">About</a></p>
							<Link to="/payment">
								{        
									!this.props.user ? "" : <p className="light-gray blackOnHover" style={pathname.indexOf("payment") !== -1 ? {
										color: "#000",
										borderBottom: "2px solid #000"
									} : undefined}>Plan</p>
								}
							</Link>
						{
							this.props.user
									? 
							<DropdownWrapper 
								toggleButton={this.profile_img} 
								toggleDropdown={this.props.toggleOpened}
								closeDropdown={this.props.closeDropdown}
								displayed={this.props.opened}
							>
								<div ref={this.profile_img} className={`profile-nav__img--content ${this.props.opened ? "opened" : ""}`}>
									<div onClick={this.props.toggleOpened} style={{
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
											<button className="button">View Profile</button>
										</Link>
										</div>
									</div>
									<hr />
									<div className="profile-nav__dropdown--list">
										<p className="bold">
										<Link to="/invoices">Invoices</Link></p>
										<p className="bold"><a href="#">Become Contributor</a></p>
										<hr />
										<p className="bold"><a href="#">About</a></p>
										<p className="bold"><a href="#">Twitter</a></p>
										<hr />
										<p onClick={this.props.user.logout} className="bold"><a href="#">Logout</a></p>
									</div>
									</div>
								</div>
							</DropdownWrapper>
						    : <div>
				            		<Link to="/login"><p className="light-gray"><a>Login</a></p></Link>
				            		{/*<Link to="/register"><p className="light-gray"><a>Register</a></p></Link>*/}
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