import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";

class Stories extends React.Component {
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
			                  <h2 className="pageheader-title">Stories </h2>
			                  <p className="pageheader-text">Proin placerat ante duiullam scelerisque a velit ac porta, fusce sit amet vestibulum mi. Morbi lobortis pulvinar quam.</p>
			                  {/*<div class="page-breadcrumb">
			                                <nav aria-label="breadcrumb">
			                                    <ol class="breadcrumb">
			                                        <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Dashboard</a></li>
			                                        <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Pages</a></li>
			                                        <li class="breadcrumb-item active" aria-current="page">Stories</li>
			                                    </ol>
			                                </nav>
			                            </div>*/}
			                </div>
			              </div>
			            </div>
			            {/* ============================================================== */}
			            {/* end pageheader */}
			            {/* ============================================================== */}
			            <div className="page-header">
			              <div className="input-group col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
			                <input type="text" className="form-control" placeholder="Search by story name" />
			                <div className="input-group-append">
			                  <button type="submit" className="btn btn-primary">Search</button>
			                </div>
			              </div>
			            </div>
			            <div className="row">
			              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
			                <div className="card">
			                  <div style={{marginTop: '20px', marginRight: '20px'}}><a href="create-stories.html" className="btn btn-primary float-right">Add new story</a>
			                    <h5 className="card-header">List of all stories</h5>
			                  </div>
			                  <div className="card-body">
			                    <table className="table">
			                      <thead>
			                        <tr>
			                          <th scope="col">#</th>
			                          <th scope="col">Name</th>
			                          <th scope="col">Category</th>
			                          <th scope="col"> </th>
			                        </tr>
			                      </thead>
			                      <tbody>
			                        <tr>
			                          <th scope="row">1</th>
			                          <td>Facebook app</td>
			                          <td>Social Networking</td>
			                          <td><div className="dd-nodrag btn-group ml-auto">
			                              <button className="btn btn-sm btn-outline-light">Edit</button>
			                              <button className="btn btn-sm btn-outline-light">
			                                <i className="far fa-trash-alt" />
			                              </button>
			                            </div></td>
			                        </tr>
			                        <tr>
			                          <th scope="row">2</th>
			                          <td>iNZDR</td>
			                          <td>Social Networking</td>
			                          <td><div className="dd-nodrag btn-group ml-auto">
			                              <button className="btn btn-sm btn-outline-light">Edit</button>
			                              <button className="btn btn-sm btn-outline-light">
			                                <i className="far fa-trash-alt" />
			                              </button>
			                            </div></td>
			                        </tr>
			                        <tr>
			                          <th scope="row">3</th>
			                          <td>Quora</td>
			                          <td>News</td>
			                          <td><div className="dd-nodrag btn-group ml-auto">
			                              <button className="btn btn-sm btn-outline-light">Edit</button>
			                              <button className="btn btn-sm btn-outline-light">
			                                <i className="far fa-trash-alt" />
			                              </button>
			                            </div></td>
			                        </tr>
			                        <tr>
			                          <th scope="row">4</th>
			                          <td>Slack</td>
			                          <td>Work tool</td>
			                          <td><div className="dd-nodrag btn-group ml-auto">
			                              <button className="btn btn-sm btn-outline-light">Edit</button>
			                              <button className="btn btn-sm btn-outline-light">
			                                <i className="far fa-trash-alt" />
			                              </button>
			                            </div></td>
			                        </tr>
			                        <tr>
			                          <th scope="row">5</th>
			                          <td>AliExpress</td>
			                          <td>Shopping</td>
			                          <td><div className="dd-nodrag btn-group ml-auto">
			                              <button className="btn btn-sm btn-outline-light">Edit</button>
			                              <button className="btn btn-sm btn-outline-light">
			                                <i className="far fa-trash-alt" />
			                              </button>
			                            </div></td>
			                        </tr>
			                        <tr>
			                          <th scope="row">6</th>
			                          <td>Busulla</td>
			                          <td>Education</td>
			                          <td><div className="dd-nodrag btn-group ml-auto">
			                              <button className="btn btn-sm btn-outline-light">Edit</button>
			                              <button className="btn btn-sm btn-outline-light">
			                                <i className="far fa-trash-alt" />
			                              </button>
			                            </div></td>
			                        </tr>
			                      </tbody>
			                    </table>
			                  </div>
			                </div>
			              </div>
			              {/* ============================================================== */}
			            </div>
			          </div>
			        </div>
			      </div>
		);
	}
}

export default Stories;