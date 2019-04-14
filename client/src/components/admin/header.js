import React from "react";
import { Link } from "react-router-dom";

class Header extends React.Component {
  render(){
    return (
        <div className="dashboard-header">
          <nav className="navbar navbar-expand-lg bg-white fixed-top">
            <a className="navbar-brand" href="../index.html" src="/assets/toolkit/images/logo.svg"><img src="/assets/toolkit/images/logo.svg" /></a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto navbar-right-top">
                <li className="nav-item dropdown nav-user">
                  <a className="nav-link nav-user-img" href="#" id="navbarDropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={`${this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"}`} alt className="user-avatar-md rounded-circle" /></a>
                  <div className="dropdown-menu dropdown-menu-right nav-user-dropdown" aria-labelledby="navbarDropdownMenuLink2">
                    <div className="nav-user-info">
                      <h5 className="mb-0 text-white nav-user-name">
                        John Abraham</h5>
                      <span className="status" /><span className="ml-2">Available</span>
                    </div>
                    <a className="dropdown-item" href="#"><i className="fas fa-user mr-2" />Account</a>
                    <a className="dropdown-item" href="#"><i className="fas fa-cog mr-2" />Setting</a>
                    <a className="dropdown-item" href="#"><i className="fas fa-power-off mr-2" />Logout</a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
    );
  }
}

export default Header;