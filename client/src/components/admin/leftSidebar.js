import React from "react";

class LeftSidebar extends React.Component {
	render(){
		return (
			<div className="nav-left-sidebar sidebar-dark">
              <div className="menu-list">
                <nav className="navbar navbar-expand-lg navbar-light">
                  <a className="d-xl-none d-lg-none" href="#">Dashboard</a>
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav">
                    <span className="navbar-toggler-icon" />
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav flex-column">
                      <li className="nav-divider">
                        Menu
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="dashboard.html" aria-expanded="false" data-target="#submenu-2"><i className="fas fa-desktop" />Dashboard</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link active" href="apps.html" aria-expanded="false" data-target="#submenu-1"><i className=" fas fa-mobile-alt" />Apps</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="Stories.html" aria-expanded="false" data-target="#submenu-1"><i className="fas fa-video" />Stories</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="users.html" aria-expanded="false" data-target="#submenu-1"><i className="far fa-user-circle" />Users</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="pro-users.html" aria-expanded="false" data-target="#submenu-1"><i className="fas fa-credit-card" />PRO Users</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="app-categories.html" aria-expanded="false" data-target="#submenu-1"><i className="fas fa-list" />App Categories</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="stories-categories.html" aria-expanded="false" data-target="#submenu-1"><i className="fas fa-server" />Stories Categories</a>
                      </li>
                      <li className="nav-item ">
                        <a className="nav-link" href="stories-elements.html" aria-expanded="false" data-target="#submenu-1"><i className="fas fa-th" />Stories Elements</a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </div>
		)
	}
}

export default LeftSidebar;