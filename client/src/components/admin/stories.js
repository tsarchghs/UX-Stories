import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";

class Stories extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			first:5,
			storyName_contains: undefined
		}
		this.search = debounce(this.search.bind(this))
		this.searchField = undefined;
		this.loadmore = this.loadmore.bind(this);
	}
	search(){
		this.setState({
			storyName_contains: this.searchField.value
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
			            <div className="page-header">
			              <div className="input-group col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
			                <input onChange={this.search} ref={node => this.searchField = node} type="text" className="form-control" placeholder="Search by story name" />
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
			                          <th scope="col">App Name</th>
			                          <th scope="col">Story Categories</th>
			                          <th scope="col"> </th>
			                        </tr>
			                      </thead>
			                      <tbody>
			                      	<Query
			                      		query={gql`
			                      			query Stories($storiesFilterInput: StoriesFilterInput){
			                      				stories(
			                      					storiesFilterInput: $storiesFilterInput
			                      				){
			                      					id
			                      					app {
			                      						id
			                      						appCategory {
			                      							id
			                      							name
			                      						}
			                      					}
			                      					storyCategories {
			                      						id
			                      						name
			                      					}
			                      				}
			                      			}
			                      		`}
			                      		variables={{
			                      			storiesFilterInput:{
			                      				first:this.state.first,
			                      				storyName_contains: this.state.storyName_contains
			                      			}
			                      		}}
			                      	>
			                      		{ ({loading,error,data}) => {
			                      			if (loading) return <p>Loading</p>
			                      			if (error) return <p>{error.message}</p>
			                      			let stories = data.stories;
			                      			return stories.map(story => {
			                      				return (
							                        <tr>
							                          <th scope="row">{story.id}</th>
							                          <td>{story.app.appCategory.name}</td>
							                          <td>{story.storyCategories.map(storyCategory => storyCategory.name).join("/")}</td>
							                          <td><div className="dd-nodrag btn-group ml-auto">
							                              <button className="btn btn-sm btn-outline-light">Edit</button>
							                              <button className="btn btn-sm btn-outline-light">
							                                <i className="far fa-trash-alt" />
							                              </button>
							                            </div></td>
							                        </tr>
			                      				)
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
			              </div>			            </div>
			          </div>
			        </div>
			      </div>
		);
	}
}

export default Stories;