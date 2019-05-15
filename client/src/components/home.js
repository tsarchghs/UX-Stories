import React from "react";
import Header from "./header";
import AppLoading from "./appLoading";
import gql from "graphql-tag";
import { Link, withRouter } from "react-router-dom";
import { debounce } from "lodash";
import DropdownLoading from "./dropdownLoading";
import AppCategoriesDropdown from "./appCategoriesDropdown";
import { withApollo, Query, Mutation } from "react-apollo";
import Cookies from "js-cookie";
import { compose } from "recompose";
import { appsIndexHelper } from "../algoliaClients";

class _Home extends React.Component {
  constructor(props) {
    super(props);
    let filterBy = {
      appCategory: "all"
    }
    if (this.props.location && this.props.location.state && this.props.location.state.filterBy) {
      filterBy = this.props.location.state.filterBy
    }
    this.state = {
      appCategories:undefined,
      apps: undefined,
      show_skeleton: true,
      reached_end: false,
      nothing_to_show: false,
      filterBy: filterBy,
      jobs: [],
      show_email: true
    }
    this.skip = 0;
    this.loadMore = this.loadMore.bind(this);
    this.toggle = this.toggle.bind(this);
    this.update = debounce(this.update.bind(this),150);
    this.enteredEmail = this.enteredEmail.bind(this);
    this.hitsPerPage = 4
  }
  filterCategory(appCategory) {
    if (!this.state.filterBy.appCategory || !(this.state.filterBy.appCategory.id === appCategory.id)){
      this.setState(prevState => {
        let state = prevState;
        state.filterBy.appCategory = appCategory.id
        appsIndexHelper.state.hitsPerPage = this.hitsPerPage
        this.setState({apps:undefined,show_skeleton:true})
        appsIndexHelper.state.facetsRefinements["appCategory.name"] = []
        if (appCategory.name !== "all"){
          appsIndexHelper.toggleFacetRefinement("appCategory.name", appCategory.name)
        }
        return state;
      },() => this.update());
    }
  }
  async update(fromMount){
    console.log(123);
    let values = {
      reached_end: false,
      show_skeleton: true,
      nothing_to_show: false
    }
    this.setState(values)
    // quick hack to prevent error when user switches forth and back while update is being executed :'(
    // lesson learned. use refs next time
    let appName_contains = document.getElementById("appName_contains") ? document.getElementById("appName_contains").value : ""
    appsIndexHelper.setQuery(appName_contains).search();
    appsIndexHelper.on("result",data => {
      let appsData = { data : { apps: data._rawResults[0].hits } }
      this.setState(prevState => {
        let state = prevState;
        if (!state.apps){
          state.apps = []  
        }
        state.apps = appsData.data.apps
        state.reached_end = data.nbPages < 2 
        state.show_skeleton = false
        state.nothing_to_show = appsData.data.apps.length === 0
        return prevState
      })
    })
  }
  toggle(name) {
    this.setState(nextState => {
      nextState[name] = !nextState[name]
      return nextState;
    })
  }
	async componentDidMount(){
    console.log("MOUNT")
    this.update();
    let jobs = await this.props.client.query({
      query: gql`
        query {
          jobs {
            id
            name
          }
        } 
      `
    })
    this.setState({jobs:jobs.data.jobs});
	}
  async loadMore() {
    this.setState({
      show_skeleton:true
    })
    appsIndexHelper.state.hitsPerPage += this.hitsPerPage;
    this.update();
  }
  enteredEmail(e) {
    e.preventDefault();
      if (this.state.show_email) {
        this.setState({ show_email: false })
      } else {
      }
  }
	render() {
		return (
			 <div>
        <Header user={this.props.user}/>
        <div style={{display: this.props.user ? "none" : "block"}}>
          <section className="home-hero">
            <div className="home-hero__left">
              <div className="home-hero__left--content">
                <h1 className="gray bold">Find real problems solved for millions of people</h1>
                <h5 className="light-gray">UXstories is hand picked collection of top apps on App Store that have the best practises of UX from login to purchasing a product and more.</h5>
                          <Mutation
                            mutation={gql`
                              mutation SignUp(
                                $full_name: String!, $email: String!, 
                                $password: String!,$job: ID!
                              ) {
                                signUp(
                                  full_name: $full_name,
                                  email: $email,
                                  password: $password,
                                  job: $job
                                ) {
                                  token
                                }
                              } 
                            `}
                          >
                            {(signUp, { loading, error, data }) => {
                                if (data && data.signUp.token) {
                                  Cookies.set("token", data.signUp.token);
                                  this.props.refetchApp();
                                }
                                let onSubmit = (e) => {
                                  e.preventDefault();
                                  signUp({variables:{
                                    full_name: this.full_name.value,
                                    email: this.email.value,
                                    password: this.password.value,
                                    job: this.job.value
                                  }})
                                }
                                return (
                                  <form onSubmit={this.state.show_email ? this.enteredEmail : onSubmit}>
                                    <div className="home-hero__input">
                                        <input ref={node => this.email = node} style={{display: this.state.show_email ? "block" : "none" }} className="input" type="text" placeholder="Enter your email" />
                                        {
                                          !this.state.show_email &&
                                            <div className="home-hero__input">
                                            <input ref={node => this.full_name = node} className="input" type="text" placeholder="Enter your full name" />
                                          <input ref={node => this.password = node} className="input" type="password" placeholder="Enter your password" />
                                              <select ref={node => this.job = node} id="r_job">
                                                {
                                                  this.state.jobs.map(job => <option id={job.name} value={job.id}>{job.name}</option>)
                                                }
                                              </select>
                                            </div>
                                        }
                                      <button style={{ marginBottom:"0px !important"}} className="button">SIGN UP</button>
                                    </div>
                                  </form>
                                )
                            }}
                        </Mutation>                   
              </div>
            </div>
            <div style={{ backgroundImage:"url(http://localhost:3000/assets/toolkit/images/homeimg.jpg)"}} className="home-hero__img" />
          </section>
        </div>
        <div className="secondary-header">
          <div className="container">
            <div className="secodary-header__content smaller">
              <div className="flex  ac">
                <h2 className="white">Browse Apps</h2>
                <span className="seperator" />
                <div className="search">
                  <img src="/assets/toolkit/images/search-icon.svg" alt />
                  <input 
                    type="text" 
                    placeholder="Search by app name..."
                    onChange={(e) => this.update()}
                    id="appName_contains"
                  />
                </div>			
              </div>
              <div className="flex">
                <button style={{cursor:"pointer"}} onClick={e => this.toggle("appCategoryFilterOpen")} className="button white fbtn" data-toggle="first">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>
              <AppCategoriesDropdown 
                id="first" 
                filterBy={this.state.filterBy}
                style={{ top: "43.8984px", left: "-198.188px"}}
                open={this.state.appCategoryFilterOpen}
                value={this.state.filterBy.appCategory}
                handleAllFilterClick={() => this.filterCategory({id:"all",name:"all"})}
                handleFilterClick={(e,appCategory) => this.filterCategory(appCategory)} 
              />			
               </div>
            </div>
          </div>
        </div>
        <section className="apps">
          <div className="apps__container">
                {/*<p className="results__results bold">Showing {this.state.apps ? this.state.apps.length : 0} Results</p>*/}
            <div className="apps__content">
            {
              this.state.nothing_to_show
              ? <center>Nothing to show, try different filters or query.</center>
              : ""
            }
            {
              !this.state.apps ? "" :
              this.state.apps.map(app => {
                let to = {
                  pathname: `/app/${app.id}`,
                  state: {
                    filterBy: this.state.filterBy
                  }
                }
                return (
                  <div className="app">
                    <div className="apps__top">
                      <Link to={to}>
                        <div className="apps__top-image" style={{backgroundImage: `url(${app.logo.url})`}} />
                      </Link>
                      <div className="apps__top-info">
                        <Link to={to}>
                          <h5 className="bold">{app.name}</h5>
                        </Link>
                        <p className="apps__small-title light-gray">{app.description}</p>
                        <p>© Copyright <span className="bold">{app.company}</span></p>
                      </div>
                    </div>
                    <div className="apps__main">
                      <div className="apps__main-category">
                        <div>
                          <p className="apps__small-title light-gray">Category</p>
                          <p>{app.appCategory.name}</p>
                        </div>
                      <Link to={to}>
                        <button className="button naked pink">View Stories</button>
                      </Link>
                      </div>
                      <div className="apps__main-images">
                      {
                        app.stories.length ? ""
                        : <center>No stories to show</center>
                      }
                      {
                        app.stories.map(story => {
                          return (
                            <Link to={to}>
                              <div className="app__images">
                                <img src={story.thumbnail.url} alt /> 
                              </div>
                            </Link>
                          )
                        })
                      }
                      </div>
                    </div>
                  </div>
                );
              })
            }
                    {
                      this.state.show_skeleton
                      ? <div className="apps__content">
                          <AppLoading/>
                          <AppLoading/>
                          <AppLoading/>
                          <AppLoading/>
                        </div>
                      : ""
                    }
            </div>
          </div>
        </section>
        {
          !this.state.reached_end
          ? <center>
              <button onClick={this.loadMore}>Load more</button>
            </center>
          : ""
        }
        <br/>
      </div>
		);
	}
}

export default compose(withRouter,withApollo)(_Home);