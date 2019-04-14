import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { handleUploadPhotoInput } from "../../helpers";
import Loading from "../loading";
import { Link, Redirect } from "react-router-dom";
import { withApollo } from "react-apollo";

class _CreateApp extends React.Component {
	constructor(props){
		super(props);

		this.logoRef = undefined;
		this.nameRef = undefined;
		this.descriptionRef = undefined;
		this.companyRef = undefined;
		this.appCategoryRef = undefined;
		this.appVersionRef = undefined;
		this.platformRef = undefined;
	}
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
		                        <li className="breadcrumb-item"><Link to="/admin/apps"><p className="breadcrumb-link">Apps</p></Link></li>
		                        <li className="breadcrumb-item 	ve" aria-current="page">Create new app</li>
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
		                      <Query 
		                      	query={gql`
									query {
										appCategories {
									    id
									    name
									  }
									}
		                      `}>
		                      	{ ({loading,error,data}) => {
		                      		if (error) return <p>{error.message}</p>
		                      		if (loading) return <center><Loading/></center>
		                      		let appCategories = data.appCategories;
		                      		return (
				                      <Mutation 
				                      	mutation={gql`
				                      		mutation CreateApp(
				                      			$appVersion: String!
				                      			$appCategory: String!
				                      			$name: String!
				                      			$logo: FileInput!
				                      			$description: String!
				                      			$platform: Platform!
				                      			$company: String!
				                      		) {
				                      			createApp(
													appVersion: $appVersion
													appCategory: $appCategory
													name: $name
													logo: $logo
													description: $description
													platform: $platform
													company: $company
				                      			) {
			                                        id
			                                        name
			                                        appCategory {
			                                          id
			                                          name
			                                        }
			                      				}
				                      		}
				                      `}>
				                      	{ (createApp,{loading,error,data}) => {
				                      		if (data){
				                      			let query = gql`
				                                    query Apps($appFilterInput: AppFilterInput){
				                                      apps(
				                                        appFilterInput: $appFilterInput
				                                      ) {
				                                        id
				                                        name
				                                        appCategory {
				                                          id
				                                          name
				                                        }
				                                      }
				                                    }
				                      			`
				                      			try {
					                      			let app = data.createApp;
					                      			let variables = {
					                      				appFilterInput:{
					                      					first:10,
					                      					orderBy: "createdAt_DESC",
					                      					appName_contains: ""
					                      				}
					                      			}
					                      			let apps = this.props.client.readQuery({
					                      				query,
					                      				variables
					                      			});
					                      			let updated_apps = {
					                      				apps: [data.createApp].concat(apps.apps)
					                      			} 
					                      			this.props.client.writeQuery({
					                      				query,
					                      				variables,
					                      				data: updated_apps
					                      			})
				                      			} catch (e) {
				                      				console.log(this.props.client);
				                      				console.log(e);
				                      			}
				                      			return <Redirect to="/admin/apps"/>
				                      		}
				                      		return (
						                        <form className="needs-validation" onSubmit={async (e) => {
						                        	e.preventDefault();
						                        	let variables = {
														logo: {
															base64: this.logoRef.base64,
															mimetype: "image/png"
														},
														name: this.nameRef.value,
														description: this.descriptionRef.value,
														company: this.companyRef.value,
														appCategory: this.appCategoryRef.value,
														platform: this.platformRef.value,
														appVersion: this.appVersionRef.value
						                        	}
						                        	let data = await createApp({variables})
						                        	console.log(data);
						                        }}>
						                          <div className="row">
						                          {
						                          	loading ? <center><Loading/></center>
						                          	:
							                          <div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <label htmlFor="firstName">Upload logo/icon</label>
							                              <div style={{marginTop: '10px'}}>
							                                <input 
							                                	onChange={() => handleUploadPhotoInput(this.logoRef,false)} 
							                                	ref={node => this.logoRef = node}
							                                	type="file" name="pic" accept="image/*" />
							                              </div>
							                            </div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <label htmlFor="firstName">Name of the app</label>
							                              <input ref={node => this.nameRef = node} type="text" className="form-control" id="firstName" placeholder required />
							                              <div className="invalid-feedback">
							                                Valid first name is required.
							                              </div>
							                            </div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <label htmlFor="firstName">Short Description</label>
							                              <input ref={node => this.descriptionRef = node} type="text" className="form-control" id="firstName" placeholder required />
							                              <div className="invalid-feedback">
							                                Valid first name is required.
							                              </div>
							                            </div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <label htmlFor="firstName">© Company</label>
							                              <input ref={node => this.companyRef = node} type="text" className="form-control" id="firstName" placeholder required />
							                              <div className="invalid-feedback">
							                                Valid first name is required.
							                              </div>
							                            </div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <label htmlFor="firstName">App Version</label>
							                              <input ref={node => this.appVersionRef = node} type="text" className="form-control" id="firstName" placeholder required />
							                              <div className="invalid-feedback">
							                                Valid first name is required.
							                              </div>
							                            </div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <div className="form-group">
							                                <label htmlFor="input-select">Category of app</label>
							                                <select ref={node => this.appCategoryRef = node} className="form-control" id="input-select">
							                                  {
							                                  	appCategories.map(appCategory => {
							                                  		return (
							                                  			<option value={appCategory.name}>{appCategory.name}</option>
							                                  		);
							                                  	})
							                                  }
							                                </select>
							                              </div>
							                            </div>
							                            <div className="col-md-12 mb-12" style={{marginBottom: '20px'}}>
							                              <div className="form-group">
							                                <label htmlFor="input-select">Platform</label>
							                                <select ref={node => this.platformRef = node} className="form-control" id="input-select">
							                                  <option>Choose one Platform</option>
							                                  <option>IOS</option>
							                                  <option>ANDROID</option>
							                                </select>
							                              </div>
							                            </div> 
							                          <hr className="mb-12" />
							                          <button className="btn btn-primary btn-lg btn-block" type="submit">Create this app 🥳</button>
							                          </div>
						                          }
						                          </div>
						                        </form>
						                     );

				                      	}}
				                      </Mutation>
				                    )
		                      	}}
				                </Query>
		                      </div>
		                    </div>
		                  </div>
		                </div>
		              </div>
		            </div>
		          </div>
{/*		          <div className="col-md-4 mb-4">
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
		          </div>*/}
		        </div>
		      </div>
    	);
	}
}

export default withApollo(_CreateApp);