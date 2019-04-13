import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";

class AppCategories extends React.Component {
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

export default AppCategories;