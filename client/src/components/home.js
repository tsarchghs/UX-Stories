import React from "react";
import Header from "./header";
import AppLoading from "./appLoading";
import { Link, withRouter } from "react-router-dom";
import { debounce } from "lodash";
import AppCategoriesDropdown from "./appCategoriesDropdown";
import { withApollo, Query, Mutation } from "react-apollo";
import { compose } from "recompose";
import { appsIndexHelper } from "../algoliaClients";
import { if_user_call_func } from "../helpers";
import PickMembershipModal from "./pickMembershipModal"; 
import DropdownWrapper from "./wrappers/dropdownWrapper";

class _Home extends React.Component {
  constructor(props) {
    super(props);
    let filterBy = {
      appCategory: "all"
    }
    if (this.props.location && this.props.location.state && this.props.location.state.filterBy) {
      filterBy = this.props.location.state.filterBy
      if (filterBy.appCategory !== "all"){
        appsIndexHelper.toggleFacetRefinement("appCategory.name",filterBy.appCategory);
      }
    }
    this.state = {
      appCategories:undefined,
      apps: undefined,
      show_skeleton: true,
      reached_end: false,
      nothing_to_show: false,
      filterBy: filterBy,
      show_email: true,
      email: undefined,
      appName_contains: "",
      currentModal: undefined
    }
    this.skip = 0;
    this.loadMore = this.loadMore.bind(this);
    this.toggle = this.toggle.bind(this);
    this.update = debounce(this.update.bind(this),150);
    this.hitsPerPage = 4
    this.appCategoryToggleButton = React.createRef()
  }
  filterCategory(appCategory) {
    if (!this.state.filterBy.appCategory || !(this.state.filterBy.appCategory.name === appCategory.name)){
      this.setState(prevState => {
        let state = prevState;
        state.filterBy.appCategory = appCategory.name
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
  componentWillUnmount(){
    appsIndexHelper.setQuery("");
    appsIndexHelper.clearRefinements()
  }
  async update(fromMount){
    let values = {
      reached_end: false,
      show_skeleton: true,
      nothing_to_show: false
    }
    this.setState(values)
    // quick hack to prevent error when user switches forth and back while update is being executed :'(
    // lesson learned. use refs next time
    appsIndexHelper.setQuery(this.state.appName_contains).search();
    appsIndexHelper.on("result",data => {
      let apps = data._rawResults[0].hits;
      for (var x in apps){
        let app = apps[x];
        app.stories = app.stories.slice(0,3)
      }

      this.setState(prevState => {
        let state = prevState;
        if (!state.apps){
          state.apps = []  
        }
        state.apps = apps
        state.reached_end = data.nbPages < 2 
        state.show_skeleton = false
        state.nothing_to_show = apps.length === 0
        return prevState
      })
    })
  }
  toggle(value) {
    this.setState(prevState => {
      let last_value = prevState["currentDropdown"];
      prevState["currentDropdown"] = last_value === value ? undefined : value
      console.log(last_value,55,value)  
      return prevState;
    })
  }
	async componentDidMount(){
    this.update();
  }
  componentWillMount(){
    // appsIndexHelper.state.hitsPerPage = this.hitsPerPage
  }
  async loadMore() {
    this.setState({
      show_skeleton:true
    })
    appsIndexHelper.state.hitsPerPage += this.hitsPerPage;
    this.update();
  }
	render() {
		return (
			 <div>
        <Header 
          user={this.props.user}
          opened={this.state.currentDropdown === "profileDropdown"}
          toggleOpened={() => this.toggle("profileDropdown")}
          closeDropdown={() => this.setState({ currentDropdown: undefined })}
        />
        <PickMembershipModal
          modalIsOpen={this.state.currentModal === "PickMembershipModal"}
          closeModal={(e) => this.setState({ currentModal: undefined })}
          email={this.state.email}
        />
        <div style={{display: this.props.user ? "none" : "block"}}>
          <section className="home-hero">
            <div className="home-hero__left">
              <div className="home-hero__left--content">
                <h1 className="gray bold">Find real problems solved for millions of people</h1>
                <h5 className="light-gray">UXstories is hand picked collection of top apps on App Store that have the best practises of UX from login to purchasing a product and more.</h5>
                <div className="home-hero__input">
                  <form
                   style={{display: "inline"}}
                   onSubmit={e => {
                     e.preventDefault()
                     this.setState({currentModal: "PickMembershipModal"})
                  }}>
                    <input
                        onChange={e => {
                        this.setState({email: e.target.value})
                        }} style={{display: "inline"}} className="input" type="email" placeholder="Enter your email"
                        required
                      />
                        <button 
                          style={{ marginBottom:"0px !important",display: "inline"}} 
                          className="button"
                          type="submit"
                        >
                            SIGN UP
                      </button>

                  </form>
                </div>
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
                    onChange={(e) => {
                      this.setState({
                        apps: undefined,
                        nothing_to_show: false,
                        show_skeleton: true,
                        appName_contains: e.target.value
                      })  
                      this.update()
                    }}
                  />
                </div>			
              </div>
              <div className="flex">
                <button ref={this.appCategoryToggleButton} style={{cursor:"pointer"}} onClick={e => this.toggle("appCategoryFilter")} className="button white fbtn">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>
                <DropdownWrapper
                  toggleButton={this.appCategoryToggleButton}
                  toggleDropdown={() => this.toggle("appCategoryFilter")}
                  displayed={this.state.currentDropdown === "appCategoryFilter"}
                >
                  <AppCategoriesDropdown 
                    filterBy={this.state.filterBy}
                    style={{ top: "43.8984px", left: "-198.188px"}}
                    open={this.state.currentDropdown === "appCategoryFilter"}
                    value={this.state.filterBy.appCategory}
                    handleAllFilterClick={() => this.filterCategory({id:"all",name:"all"})}
                    handleFilterClick={(e,appCategory) => this.filterCategory(appCategory)}
                    use_name={true}
                  />			
                
                </DropdownWrapper>
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
              <button onClick={() => if_user_call_func(this.props.user,this.loadMore,this.setState.bind(this))}>Load more</button>
            </center>
          : ""
        }
        <br/>
      </div>
		);
	}
}

export default compose(withRouter,withApollo)(_Home);