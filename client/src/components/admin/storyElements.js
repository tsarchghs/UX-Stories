import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";

class StoryElements extends React.Component {
	render(){
		return (
			<div>
				<Header/>
				<LeftSidebar/>
		      <div className="dashboard-wrapper">
		        <div className="container-fluid dashboard-content">
		          {/* ============================================================== */}
		          {/* pageheader */}
		          {/* ============================================================== */}
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="page-header">
		                <h2 className="pageheader-title">Stories-elements </h2>
		                <p className="pageheader-text">Proin placerat ante duiullam scelerisque a velit ac porta, fusce sit amet vestibulum mi. Morbi lobortis pulvinar quam.</p>
		                {/*<div class="page-breadcrumb">
		                                <nav aria-label="breadcrumb">
		                                    <ol class="breadcrumb">
		                                        <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Dashboard</a></li>
		                                        <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Pages</a></li>
		                                        <li class="breadcrumb-item active" aria-current="page">Apps</li>
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
		              <input type="text" className="form-control" placeholder="Search by stories-elements" />
		              <div className="input-group-append">
		                <button type="submit" className="btn btn-primary">Search</button>
		              </div>
		            </div>
		          </div>
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="card">
		                <div style={{marginTop: '20px', marginRight: '20px'}}><a href="create-stories-elements.html" className="btn btn-primary float-right">Add new story-elements</a>
		                  <h5 className="card-header">List of all story-elements</h5>
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
		          {/* ============================================================== */}
		          {/* end main wrapper */}
		          {/* ============================================================== */}
		        </div>
		      </div>
		   </div>
		);
	}
}

export default StoryElements;