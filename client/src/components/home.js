import React from "react";
import Header from "./header";
import AppLoading from "./appLoading";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import {getAppCategories,getActiveFilters,insertActiveFilters,loadToolkit} from "../helpers";
import DropdownLoading from "./dropdownLoading";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appCategories:undefined,
      apps: undefined,
      show_skeleton: true,
      reached_end: false,
      nothing_to_show: false,
      filterBy: {
        appCategory: undefined
      }
    }
    this.skip = 0;
    this.loadMore = this.loadMore.bind(this);
    this.update = debounce(this.update.bind(this),500);
    this.callAllCategoriesFilterOnce = false
  }
	componentDidUpdate(){
	   loadToolkit();

	}
  filterCategory(appCategory) {
    if (appCategory.name === "all" && !this.callAllCategoriesFilterOnce){
      return;
    }
    if (!this.state.filterBy.appCategory || !(this.state.filterBy.appCategory.id === appCategory.id)){
      this.setState(prevState => {
        let state = prevState;
        state.filterBy.appCategory = appCategory.name
      },() => this.update(null,true));
    }
  }
  async update(e,resetApps){
    let values = {
      reached_end: false,
      show_skeleton: true,
      nothing_to_show: false
    }
    if (resetApps){
      this.skip = 0
      values["apps"] = undefined
    }
    this.setState(values)
    // quick hack to prevent error when user switches forth and back while update is being executed :'(
    // lesson learned. use refs next time
    let appName_contains = document.getElementById("appName_contains") ? document.getElementById("appName_contains").value : ""
    let appsData = await this.props.client.query({
      query: gql`
        query {
          apps(appFilterInput:
              {
                first:4,
                skip:${this.skip},
                appName_contains:"${appName_contains}"
                ${this.state.filterBy.appCategory ? `appCategory: "${this.state.filterBy.appCategory}"` : ""}
              }) {
            id
            name
            description
            logo {
              id
              url
            }
            stories(first:3) {
              id
              thumbnail {
                id
                url
              }
            }
            appCategory {
              id
              name
            }
            company
          }
        }
      `
    })
    this.setState(prevState => {
      let state = prevState;
      if (!state.apps){
        state.apps = []  
      }
      state.apps = state.apps.concat(appsData.data.apps)
      state.reached_end = appsData.data.apps.length < 4
      state.show_skeleton = false
      state.nothing_to_show = appsData.data.apps.length === 0
      return prevState
    })
  }
	async componentDidMount(){
		this.loadToolkit();
    this.update();
    let appCategories = await getAppCategories(this.props.client).then();
    this.setState({
      appCategories
    },document.getElementById("allCategoriesFilter").click());
	}
  async loadMore() {
    this.skip += 4
    this.update();
  }
	loadToolkit() {
	      let script = document.createElement("script");
	      script.src = "/assets/toolkit/scripts/toolkit.js"
	      script.async = true;
	      document.body.appendChild(script);
	      console.log(123);	
	}
	render() {
		return (
			 <div>
        <Header user={this.props.user}/>
        <section style={{display:"none"}} className="home-hero">
          <div className="home-hero__left">
            <div className="home-hero__left--content">
              <h1 className="gray bold">Find real problems solved for millions of people</h1>
              <h5 className="light-gray">UXstories is hand picked collection of top apps on App Store that have the best practises of UX from login to purchasing a product and more.</h5>
              <div className="home-hero__input">
                <input className="input" type="text" placeholder="Enter your email" />
                <button className="button">SIGN UP</button>
              </div>
            </div>
          </div>
          <div className="home-hero__img" />
        </section>
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
                    onChange={(e) => this.update(e,true)}
                    id="appName_contains"
                  />
                </div>			
              </div>
              <div className="flex">
                <button className="button white fbtn" data-toggle="first">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>
                <div className="filter" id="first" data-dropdown data-auto-focus="true">
                  <div className="filter-dropdown">
                  <label className="radio-t rde">
                    <label className="gray bold">All</label>
                    <input 
                      className="ic" 
                      type="radio" 
                      name="categoryFilter"
                      onClick={() => this.filterCategory({id:"all",name:"all"})}
                    />
                    <span id="allCategoriesFilter" className="checkmark"/>
                  </label>
                  {
                    !this.state.appCategories 
                    ? <DropdownLoading/>
                    : <div>
                      {
                        this.state.appCategories.map(appCategory => {
                          return (

                            <label className="radio-t rde">
                              <label id={appCategory.id+"_label"} className="gray bold">{appCategory.name}</label>
                              <input 
                                className="ic" 
                                type="radio" 
                                name={"categoryFilter"}
                                onClick={() => this.filterCategory(appCategory)}
                              />
                              <span className="checkmark"/>
                            </label>
                          );
                        })
                      } 
                    </div>
                  }
                  </div>
                </div>				
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
                return (
                  <div className="app">
                    <div className="apps__top">
                      <Link to={`/app/${app.id}`}>
                        <div className="apps__top-image" style={{backgroundImage: 'url("/assets/toolkit/images/netflix-logo.jpg")'}} />
                      </Link>
                      <div className="apps__top-info">
                        <Link to={`/app/${app.id}`}>
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
                      <Link to={`/app/${app.id}`}>
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
                            <Link to={`/app/${app.id}`}>
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

export default Home;