import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { debounce } from "lodash";
import { Mutation, withApollo } from "react-apollo";
import { Link, Redirect } from "react-router-dom";
import gql from "graphql-tag";
import Loading from "../loading";

class CreateAppCategory extends React.Component {
	constructor(props){
		super(props);
		this.name = undefined;
	}
	render(){
		return (
			<div>
               <Header/>
               <LeftSidebar/>
		        <div className="dashboard-wrapper">
		          <div className="container-fluid dashboard-content">
		            <div className="row">
		              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		                <div className="page-header">
		                  <h2 className="pageheader-title">Create new App Category</h2>
		                  <div className="page-breadcrumb">
		                    <nav aria-label="breadcrumb">
		                      <ol className="breadcrumb">
		                        <li className="breadcrumb-item">
		                        <Link to="/admin/app_categories">
		                        	<p className="breadcrumb-link">App Categories</p>
		                        </Link>	
		                        </li>
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
		                <Mutation 
		                	mutation={gql`
			                	mutation CreateAppCategory($name: String!){
			                		createAppCategory(name: $name){
			                			id
			                			name
			                		}	
			                	}	
		               	`}>
		               		{ (createAppCategory,{loading,error,data}) => {
		               			console.log(data,4);
		               			if (data) {
		               				try {
			               				let query = gql`
											query AppCategoriesConnection($first: Int,$skip: Int,$name_contains: String,$orderBy: ORDER_BY){
												appCategoriesConnection(
													first: $first,
													skip: $skip,
													name_contains: $name_contains
													orderBy: $orderBy
												) {
												    pageInfo {
												      hasNextPage
												    }
												    nodes {
														id
												     	name
												    }
												    aggregate {
														count
												    }
												}
											}
			               				`
			               				let appCategory = data.createAppCategory;
			               				let variables = {
			               					first:10,
			               					name_contains: "",
			               					orderBy: "createdAt_DESC"
			               				}
			               				let appCategories = this.props.client.readQuery({
			               					query,
			               					variables
			               				})
			               				let new_data = appCategories.appCategoriesConnection
			               				new_data.nodes = [appCategory].concat(new_data.nodes)
			               				new_data.aggregate.count++;
			               				this.props.client.writeQuery({query,variables,data:{appCategoriesConnection:new_data}})
		               				} catch (e) {
		               					console.log(e);
		               				}
		               				return <Redirect to="/admin/app_categories"/>
		               			}
		               			if (loading) return <center><Loading/></center>
		               			if (error) return <h5>{error.message}</h5>
		               			return (
					                <form onSubmit={async (e) => {
					                	e.preventDefault();
					                	let variables = { name: this.name.value }
					                	let data = await createAppCategory({variables})
					                	console.log(data);
					                }}>
						                <div className="row">
						                  <div className="col-md-8">
						                    <div className="card">
						                      <div className="card-header">
						                        <h4 className="mb-0">Creating new App Category</h4>
						                      </div>
						                      <div className="col-md-12 mb-12" style={{marginTop: '30px'}}>
						                        <label htmlFor="firstName">Name of the app-category</label>
						                        <input ref={node => this.name = node} type="text" className="form-control" id="firstName" placeholder required />
						                        <div className="invalid-feedback">
						                          Valid first name is required.
						                        </div>
						                        <hr className="mb-12" />
						                        <button className="btn btn-primary btn-lg btn-block" type="submit" style={{marginBottom: '20px'}}>Create this app category🥳</button>
						                      </div>
						                    </div>
						                  </div>
						                </div>
						            </form>
					         	)
		               		}}
		               	</Mutation>
		              </div>
		            </div>
		            {/*<div className="row offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
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
		            </div>*/}
		          </div>
		        </div>
		      </div>
		);
	}
}

export default withApollo(CreateAppCategory);