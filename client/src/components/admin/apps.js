import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";

class Apps extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      first:10,
      appName_search: undefined,
      hasNextPage: undefined
    }
    this.appName_search = undefined;
    this.search = debounce(this.search.bind(this))
    this.loadmore = this.loadmore.bind(this);
  }
  search() {
    this.setState({
      appName_search: this.appName_search.value
    })
  }
  loadmore(){
    this.setState(prevState => {
      let state = prevState
      state.first += 10
      return state
    })
  }
  render(){
      return (
          <div className="dashboard-main-wrapper">
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
                          <h2 className="pageheader-title">Apps </h2>
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
                        <input onChange={this.search} ref={node => this.appName_search = node} type="text" className="form-control" placeholder="Search by app name" />
                        <div className="input-group-append">
                          <button onClick={this.search} type="submit" className="btn btn-primary">Search</button>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card">
                          <div style={{marginTop: '20px', marginRight: '20px'}}><a href="create-app.html" className="btn btn-primary float-right">Add new app</a>
                            <h5 className="card-header">List of all apps</h5>
                          </div>
                          <div className="card-body">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Name</th>
                                  <th scope="col">Category</th>
                                  <th scope="col"> </th>
                                </tr>
                                <Query
                                  query={gql`
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
                                `} variables={{appFilterInput:{
                                           first:this.state.first,
                                           appName_contains:this.state.appName_search ? this.state.appName_search : ""
                                         }}
                                       }>
                                  { ({loading,error,data,refetch}) => {
                                      if (loading) return <center><h4>Loading</h4></center>
                                      if (error) return <h3>{error.message}</h3>
                                      let apps = data ? data.apps : []
                                      return apps.map(app => {
                                        return (
                                          <tr>
                                            <th scope="row">{app.id}</th>
                                            <td>{app.name}</td>
                                            <td>{app.appCategory.name}</td>
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
                      </div>
                      {/* ============================================================== */}
                    </div>
                    {/* ============================================================== */}
                    {/* end main wrapper */}
                    {/* ============================================================== */}
                  </div>
                </div></div>
        );
    }
}

export default Apps;