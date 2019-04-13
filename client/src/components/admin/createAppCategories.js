import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";

class CreateAppCategories extends React.Component {
	render(){
		return (
			<div>
               <Header/>
               <LeftSidebar/>
		        <div className="nav-left-sidebar sidebar-dark">
		          <div className="menu-list">
		            <nav className="navbar navbar-expand-lg navbar-light">
		              <a className="d-xl-none d-lg-none" href="#">Dashboard</a>
		              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
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
		                    <a className="nav-link" href="apps.html" aria-expanded="false" data-target="#submenu-1"><i className=" fas fa-mobile-alt" />Apps</a>
		                  </li>
		                  <li className="nav-item ">
		                    <a className="nav-link active" href="Stories.html" aria-expanded="false" data-target="#submenu-1"><i className="fas fa-video" />Stories</a>
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
		        {/* ============================================================== */}
		        {/* end left sidebar */}
		        {/* ============================================================== */}
		        {/* ============================================================== */}
		        {/* wrapper  */}
		        {/* ============================================================== */}
		        <div className="dashboard-wrapper">
		          <div className="container-fluid dashboard-content">
		            {/* ============================================================== */}
		            {/* pageheader */}
		            {/* ============================================================== */}
		            <div className="row">
		              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		                <div className="page-header">
		                  <h2 className="pageheader-title">Create new App Category</h2>
		                  <div className="page-breadcrumb">
		                    <nav aria-label="breadcrumb">
		                      <ol className="breadcrumb">
		                        <li className="breadcrumb-item"><a href="app-categories.html" className="breadcrumb-link">App Categories</a></li>
		                        <li className="breadcrumb-item active" aria-current="page">Create new app-category</li>
		                      </ol>
		                    </nav>
		                  </div>
		                </div>
		              </div>
		            </div>
		            {/* ============================================================== */}
		            {/* end pageheader */}
		            {/* ============================================================== */}
		            <div className="page-header">
		            </div>
		            <div className="row">
		              <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
		                <div className="row">
		                  <div className="col-md-8">
		                    <div className="card">
		                      <div className="card-header">
		                        <h4 className="mb-0">Creating new App Category</h4>
		                      </div>
		                      <div className="col-md-12 mb-12" style={{marginTop: '30px'}}>
		                        <label htmlFor="firstName">Name of the app-category</label>
		                        <input type="text" className="form-control" id="firstName" placeholder defaultValue required />
		                        <div className="invalid-feedback">
		                          Valid first name is required.
		                        </div>
		                        <hr className="mb-12" />
		                        <button className="btn btn-primary btn-lg btn-block" type="submit" style={{marginBottom: '20px'}}>Create this app category🥳</button>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            </div>
		            <div className="row offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="card">
		                <div className="card-header">
		                  <h4 className="d-flex justify-content-between align-items-center mb-0">
		                    <span className="text-muted">Delete this story</span>
		                  </h4>
		                </div>
		                <div className="card-body">
		                  <label htmlFor="firstName">Are you sure you want to delete this story?</label>    
		                  <a href="#" className="btn btn-secondary">Delete it 😭</a>
		                </div>
		              </div>
		            </div>
		            {/* ============================================================== */}
		          </div>
		        </div>
		      </div>
		);
	}
}

export default CreateAppCategories;