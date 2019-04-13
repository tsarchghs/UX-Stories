import React from "react";
import { Link } from "react-router-dom";

class LeftSidebar extends React.Component {
	render(){
		let location = window.location.href.split("/");
		let path = location[location.length-1] // after /admin/
		return (
			<div className="nav-left-sidebar sidebar-dark">
              <div className="menu-list">
                <nav className="navbar navbar-expand-lg navbar-light">
                  <a className="d-xl-none d-lg-none">Dashboard</a>
                  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav">
                    <span className="navbar-toggler-icon" />
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav flex-column">
                      <li className="nav-divider">
                        Menu
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/dashboard">
                        	<a className={`nav-link ${`light-gray ${path === "dashboard" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-2"><i className="fas fa-desktop" />Dashboard</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/apps">
                        	<a className={`nav-link ${`light-gray ${path === "apps" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className=" fas fa-mobile-alt" />Apps</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/stories">	
                        	<a className={`nav-link ${`light-gray ${path === "stories" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className="fas fa-video" />Stories</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/users">
                        	<a className={`nav-link ${`light-gray ${path === "users" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className="far fa-user-circle" />Users</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/pro_users">
                        	<a className={`nav-link ${`light-gray ${path === "pro_users" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className="fas fa-credit-card" />PRO Users</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/app_categories">
                        	<a className={`nav-link ${`light-gray ${path === "app_categories" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className="fas fa-list" />App Categories</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/story_categories">
                        	<a className={`nav-link ${`light-gray ${path === "story_categories" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className="fas fa-server" />Stories Categories</a>
                      	</Link>
                      </li>
                      <li className="nav-item ">
                      	<Link to="/admin/story_elements">
                        	<a className={`nav-link ${`light-gray ${path === "story_elements" || path === "#" ? "active" : ""}`}`} aria-expanded="false" data-target="#submenu-1"><i className="fas fa-th" />Stories Elements</a>
                      	</Link>
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