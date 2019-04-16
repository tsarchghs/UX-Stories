import React from "react";
import Header from "./header";
import LeftSidebar from "./leftSidebar";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

class AppList extends React.Component {
  render(){
    return this.props.apps.map(app => {
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
  }
}

class Apps extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      first:10,
      appName_search: undefined,
      fetchMoreResult: true,
    }
    this.appName_search = undefined;
    this.search = debounce(this.search.bind(this))
    this.fetchMore = undefined;
  }
  search() {
    this.setState({
      appName_search: this.appName_search.value,
      fetchMoreResult: true
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
                          <div style={{marginTop: '20px', marginRight: '20px'}}>
                          <Link to="create_app">
                            <p className="btn btn-primary float-right">Add new app</p>
                          </Link>
                            <h5 className="card-header">List of all apps</h5>
                          </div>
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
                                           first: this.state.first,
                                           appName_contains:this.state.appName_search ? this.state.appName_search : "",
                                           orderBy: "createdAt_DESC"
                                         }}
                                       }>
                                  { ({loading,error,data,fetchMore}) => {
                                      let onLoadMore = () => {
                                            let results = fetchMore({
                                                variables: {appFilterInput:{
                                                   skip:data.apps.length,
                                                   first: this.state.first,
                                                   appName_contains:this.state.appName_search ? this.state.appName_search : "",
                                                   orderBy: "createdAt_DESC"
                                                 }
                                              },
                                              updateQuery: (prev, { fetchMoreResult }) => {
                                                if (fetchMoreResult.apps.length < 10) {
                                                  this.setState({
                                                    fetchMoreResult: false
                                                  },() => console.log(this.state.fetchMoreResult))
                                                  return prev;
                                                }
                                                console.log(prev);
                                                return Object.assign({},prev,{
                                                  apps: [...prev.apps, ...fetchMoreResult.apps]
                                                })
                                              }
                                          })
                                        }
                                      if (loading) return <center><h4>Loading</h4></center>
                                      if (error) return <h3>{error.message}</h3>
                                      let apps = data.apps
                                      return (
                                          <div className="card-body">
                                            <table className="table">
                                              <tbody>
                                                <tr>
                                                  <th scope="col">#</th>
                                                  <th scope="col">Name</th>
                                                  <th scope="col">Category</th>
                                                  <th scope="col"> </th>
                                                </tr>
                                                    <AppList apps={apps}/>
                                                </tbody>
                                            </table>
                                            {
                                              !this.state.fetchMoreResult ? ""
                                              :<center><p onClick={onLoadMore} style={{marginTop:3}} className="btn btn-primary">Load more</p></center>
                                            }
                                          </div>
                                        )
                                  }}
                                </Query>

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