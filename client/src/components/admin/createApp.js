import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";

class CreateApp extends React.Component {
	render(){
		return (
      		<div className="dashboard-main-wrapper">

		        <Header/>
				<LeftSidebar/>

		        <div className="dashboard-wrapper">
		          <div className="container-fluid dashboard-content">

		            <div className="row">
		              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		                <div className="page-header">
		                  <h2 className="pageheader-title">Create new app</h2>
		                  <p className="pageheader-text">Proin placerat ante duiullam scelerisque a velit ac porta, fusce sit amet vestibulum mi. Morbi lobortis pulvinar quam.</p>
		                  <div className="page-breadcrumb">
		                    <nav aria-label="breadcrumb">
		                      <ol className="breadcrumb">
		                        <li className="breadcrumb-item"><a href="apps.html" className="breadcrumb-link">Apps</a></li>
		                        <li className="breadcrumb-item active" aria-current="page">Create new app</li>
		                      </ol>
		                    </nav>
		                  </div>
		                </div>
		              </div>
		            </div>

		            <div className="page-header">
		            </div>
		            <div className="row">
		              <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
		                <div className="row">
		                  <div className="col-md-8">
		                    <div className="card">
		                      <div className="card-header">
		                        <h4 className="mb-0">Creating new app</h4>
		                      </div>
		                      <div className="card-body">
		                        <form className="needs-validation" noValidate>
		                          <div className="row">
		                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
		                              <label htmlFor="firstName">Upload logo/icon</label>
		                              <div style={{marginTop: '10px'}}>
		                                <input type="file" name="pic" accept="image/*" />
		                              </div>
		                            </div>
		                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
		                              <label htmlFor="firstName">Name of the app</label>
		                              <input type="text" className="form-control" id="firstName" placeholder defaultValue required />
		                              <div className="invalid-feedback">
		                                Valid first name is required.
		                              </div>
		                            </div>
		                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
		                              <label htmlFor="firstName">Short Description</label>
		                              <input type="text" className="form-control" id="firstName" placeholder defaultValue required />
		                              <div className="invalid-feedback">
		                                Valid first name is required.
		                              </div>
		                            </div>
		                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
		                              <label htmlFor="firstName">© Company</label>
		                              <input type="text" className="form-control" id="firstName" placeholder defaultValue required />
		                              <div className="invalid-feedback">
		                                Valid first name is required.
		                              </div>
		                            </div>
		                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
		                              <div className="form-group">
		                                <label htmlFor="input-select">Category of app</label>
		                                <select className="form-control" id="input-select">
		                                  <option>Choose one Category</option>
		                                  <option>Business</option>
		                                  <option>Education</option>
		                                  <option>Entertainment</option>
		                                  <option>Finance</option>
		                                </select>
		                              </div>
		                            </div>
		                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
		                              <div className="form-group">
		                                <label htmlFor="input-select">Platform</label>
		                                <select className="form-control" id="input-select">
		                                  <option>Choose one Platform</option>
		                                  <option>iOS</option>
		                                  <option>Android</option>
		                                </select>
		                              </div>
		                            </div> 
		                          </div>
		                          <hr className="mb-12" />
		                          <button className="btn btn-primary btn-lg btn-block" type="submit">Create this app 🥳</button>
		                        </form>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            </div>
		          </div>
		          <div className="col-md-4 mb-4">
		            <div className="card">
		              <div className="card-header">
		                <h4 className="d-flex justify-content-between align-items-center mb-0">
		                  <span className="text-muted">Delete this app</span>
		                </h4>
		              </div>
		              <div className="card-body">
		                <label htmlFor="firstName">Are you sure you want to delete this app?</label>    
		                <a href="#" className="btn btn-secondary">Delete it 😭</a>
		              </div>
		            </div>
		          </div>
		        </div>
		      </div>
    	);
	}
}

export default CreateApp;