import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";

class Users extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			first:5,
			full_name_contains: undefined
		}
		this.search = debounce(this.search.bind(this))
		this.searchField = undefined;
		this.loadmore = this.loadmore.bind(this);
	}
	search(){
		this.setState({
			full_name_contains: this.searchField.value
		})
	}
	loadmore(){
		this.setState(prevState => {
			let state = prevState;
			state.first += 5
			return state;
		})
	}
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
		                <h2 className="pageheader-title">Users </h2>
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
		              <input ref={node => this.searchField = node} onChange={this.search} type="text" className="form-control" placeholder="Search users" />
		              <div className="input-group-append">
		                <button type="submit" className="btn btn-primary">Search</button>
		              </div>
		            </div>
		          </div>
		          <div className="row">
		            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
		              <div className="card">
		                <h5 className="card-header">List of all users</h5>
		                <div className="card-body">
		                  <table className="table">
		                    <thead>
		                      <tr>
		                        <th scope="col">#</th>
		                        <th scope="col">Full_name</th>
		                        <th scope="col">Email</th>
		                        <th scope="col"> </th>
		                      </tr>
		                    </thead>
		                    <tbody>
		                    	<Query
		                    		query={gql`
		                    			query Users($userFilterInput: UserFilterInput){
		                    				users(
		                    					userFilterInput: $userFilterInput
		                    				) {
		                    					id
		                    					full_name
		                    					email
		                    				}
		                    			}
		                    		`}
		                    		variables={{userFilterInput:{
		                    			first:this.state.first,
		                    			full_name_contains:this.state.full_name_contains
		                    		}}}
		                    	>
		                    		{ ({loading,error,data}) => {
		                    			if (loading) return <h2>Loading</h2>
		                    			if (error) return <p>{error.message}</p>
		                    			let users = data.users;
		                    			return users.map(user => {
		                    				return (
						                      <tr>
						                        <th scope="row">{user.id}</th>
						                        <td>{user.full_name}</td>
						                        <td>{user.email}</td>
						                        <td><div className="dd-nodrag btn-group ml-auto">
						                            <button className="btn btn-sm btn-outline-light">Edit</button>
						                            <button className="btn btn-sm btn-outline-light">
						                              <i className="far fa-trash-alt" />
						                            </button>
						                          </div></td>
						                      </tr>
		                    				);
		                    			})

		                    		}}
		                    	</Query>
		                    </tbody>
		                  </table>
		                </div>
	                          {
	                            false ? ""
	                            :  <center>
	                                <h4 onClick={this.loadmore}>Load more</h4>
	                              </center>
	                          }
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

export default Users