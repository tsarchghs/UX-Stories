import React from "react";
import InsideHeader from "./insideHeader";
import Loading from "./loading";
import {
  getActiveFilters,
  insertActiveFilters,
  if_user_call_func,
  onAlgoliaError
} from "../helpers";
import E404 from "./E404";
import SingleAppLoading from "./singleAppLoading";
import { Link, withRouter } from "react-router-dom";
import { withApollo } from "react-apollo";
import AppVersionsDropdown from "./appVersionsDropdown";
import StoryCategoriesDropdown from "./storyCategoriesDropdown";
import StoryElementsDropdown from "./storyElementsDropdown";
import { compose } from "recompose";
import { APP_QUERY } from "../Queries";
import { storiesIndexHelper_singleApp } from "../algoliaClients";
import PickMembershipModal from "./pickMembershipModal"; 


const SKELETON = <div>
  <img style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }} src="data:image/png;base64,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" />
  <img style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }} src="data:image/png;base64,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" />
  <img style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }} src="data:image/png;base64,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" />
  <img style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }} src="data:image/png;base64,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" />
  <img style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }} src="data:image/png;base64,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" />
  <img style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }} src="data:image/png;base64,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" />
</div>

class _SingleApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      app: undefined,
      stories: undefined,
      filterBy: {
        storyCategories: {},
        storyElements: {},
        appVersions:{}
      },
      show404: false,
      reached_end: false
    }
    this.skip = 0
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.hasFilters = this.hasFilters.bind(this)
    this.getFormattedFilterBy = this.getFormattedFilterBy.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.reachedEndFindOnce = true
    if (this.props.match.params.id[this.props.match.params.id.length-1] === "#"){
      this.app_id = this.props.match.params.id[this.props.match.params.id.length-1]
    } else {
      this.app_id = this.props.match.params.id
    }
    this.hitsPerPage = 6
    this.setState = this.setState.bind(this)
  } 
	async componentDidMount(){
    let app = await this.props.client.query({
      query: APP_QUERY,
      variables: { id: this.app_id }
    })
    this.skip += 6;
    if (!app.data.app){
      this.setState({
        show404: true
      })
      return;
    }
    this.setState({
      app: app.data.app
    })
    storiesIndexHelper_singleApp.state.hitsPerPage = this.hitsPerPage
    storiesIndexHelper_singleApp.state.facetsRefinements = {}
    storiesIndexHelper_singleApp.toggleFacetRefinement("app.id", this.app_id);
    this.updateResults();
  }
  async updateResults(pagination){
    this.setState(prevState => {
      let state = prevState
      if (!pagination) state.stories = undefined
      state.show_loading = true
      return state;
    })
    let filters = { "storyCategories": [], "storyElements": [] };
    filters = insertActiveFilters(filters, this.state);
    if (pagination) {
      storiesIndexHelper_singleApp.state.hitsPerPage += this.hitsPerPage
    }

    storiesIndexHelper_singleApp.search();
    onAlgoliaError(storiesIndexHelper_singleApp, this.setState, { show_loading: false })
    storiesIndexHelper_singleApp.on("result", data => {
      let stories = data.hits;
      this.setState(prevState => {
        let state = prevState;
        state.reached_end = stories.length < storiesIndexHelper_singleApp.state.hitsPerPage
        if (pagination) {
          let new_stories = stories.slice(state.stories.length, 999)
          state.stories = state.stories.concat(new_stories);
        } else {
          state.stories = stories
        }
        state.show_loading = false
        return state
      })
    })
  }
  componentWillUnmount() {
    storiesIndexHelper_singleApp.setQuery("");
    storiesIndexHelper_singleApp.clearRefinements()
  }
  async handleFilterClick(e, obj,type) {
    this.skip = 0;
    storiesIndexHelper_singleApp.state.hitsPerPage = this.hitsPerPage
    storiesIndexHelper_singleApp.toggleFacetRefinement(`${type}.name`, obj.name);
    this.setState((prevState) => {
      let state = prevState;
      state.show_loading = true;
        if (type === "appVersions"){
          state.filterBy.appVersions = {}
          storiesIndexHelper_singleApp.state.facetsRefinements["appVersions.name"] = []
        }
      state.filterBy[type] = {
        ...state.filterBy[type],
        [obj.name]: !state.filterBy[type][obj.name]
      }
      return state
    })
    this.updateResults()
  }
  getFormattedFilterBy(){
    let filters = { "storyCategories": [], "appVersions": [], "storyElements": [] };
    filters = insertActiveFilters(filters, this.state);
    return filters
  }
  resetFilters() {
    this.skip = 0
    this.setState(prevState => {
      let state = prevState;
      state.filterBy.appVersions = {}
      state.filterBy.storyCategories = {}
      state.filterBy.storyElements = {}
      state.show_loading = true
      state.stories = undefined
      storiesIndexHelper_singleApp.state.facetsRefinements = {}
      storiesIndexHelper_singleApp.toggleFacetRefinement("app.id", this.app_id);
      return state;
    },this.updateResults);
  }
  componentWillMount(){
    console.log(5555555)
  }
  unFilter(type, obj) {
    console.log(type,obj)
    if (this.state.stories) {
      this.setState({
        stories: undefined,
        show_loading: true
      })
    }
    this.setState(prevState => {
      let state = prevState;
      if (type === "appCategory") {
        storiesIndexHelper_singleApp.state.facetsRefinements["app.appCategory.name"] = []
        state.filterBy.appCategory = undefined
      } else {
        let facets = storiesIndexHelper_singleApp.state.facetsRefinements[`${type}.name`];
        let obj_name = obj
        storiesIndexHelper_singleApp.state.facetsRefinements[`${type}.name`] = facets.filter(x => x !== obj_name);
        state.filterBy[type][obj] = false;
      }
      return state;
    }, this.updateResults)
  }
  toggle(name) {
    this.setState(nextState => {
      nextState.currentDropdown = nextState.currentDropdown === name ? undefined : name
      return nextState;
    })
  }
  hasFilters(){
    return Object.keys(getActiveFilters(this.state, "storyCategories")).length ||
      Object.keys(getActiveFilters(this.state, "storyElements")).length ||
      Object.keys(getActiveFilters(this.state, "appVersions")).length
  }
	render(){
    const BELOW_HEADER = (
      <div className="results">
        <div className="container">
          <div className="results__content" style={{
            display: this.hasFilters() ? "" : "none"
          }}>
            <p className="results__results bold">Showing {this.state.stories ? this.state.stories.length : 0} Results</p>
            {
              Object.keys(this.state.filterBy).map(type_ => {
                return getActiveFilters(this.state, type_).map(obj => {
                  return (
                    <div className="ux-label ">
                      <p className="light-gray">{obj}</p>
                      <span style={{"cursor":"pointer"}}><p><img onClick={e => this.unFilter(type_, obj)} src="/assets/toolkit/images/008-delete.svg" alt /></p></span>
                    </div>
                  );
                })
              }).flat()
            }
            <hr />
            <br />

            {
              this.hasFilters()
                ? <p onClick={this.resetFilters} className="pink">Clear all filters</p>
                : ""
            }
          </div>
        </div>
      </div>
    )
    if (this.state.app){
      var len = this.state.app.appVersions.length;
      var current_version;
      if (!len) current_version = "None";
      else current_version = this.state.app.appVersions[len-1].name 
    }
    if (this.state.show404) return <E404 />
   
    let state = {}
    if (this.props.location && this.props.location.state) {
      state["filterBy"] = this.props.location.state.filterBy
    } 
		return (
      <div>
        <PickMembershipModal
          modalIsOpen={this.state.currentModal === "PickMembershipModal"}
          closeModal={(e) => this.setState({ currentModal: undefined })}
        />
        <div className="header back__header">
          <InsideHeader
            back_to_msg="Back to apps"
            back_to_path="/"
            state={state}
            user={this.props.user}
          />
        {

          !this.state.app || this.state.show404 ? 
          (
            this.state.show404 ? "" : <SingleAppLoading/>
          )

          :
          
          (
            <div className="container">
          <div className="flex">
              <div className="asided">
                <div className="asided__image" style={{backgroundImage: `url("${this.state.app.logo.url}")`}} />
                <h2 className="bold">{this.state.app.name}</h2>
                <p className="light-gray">{this.state.app.description}</p>
                <p className="bold">© Copyright {this.state.app.company}</p>
                <span className="horisontal-seperator" />
                <p className="light-gray">Category</p>
                <h5 className="bold">{this.state.app.appCategory.name}</h5>
                <span className="horisontal-seperator" />
                <p className="light-gray">Current version</p>
                <h5 className="bold">{current_version}</h5>
              </div>
            <div style={{width:"100%"}}>
              <div className="container">
                <div className="secodary-header__content">
                  <div className="colored">

      <div className="flex">
        <button onClick={() => this.toggle("storyCategoriesFilterOpen")} className="button white fbtn" data-toggle="first">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>
        <StoryCategoriesDropdown 
          id="first"
          state={this.state}
          app={this.app_id}
          filterBy={this.state.filterBy}
          style={{top: "43.8984px",left: "-198.188px"}}
          open={this.state.currentDropdown === "storyCategoriesFilterOpen"}
          handleFilterClick={(e,storyCategory) => this.handleFilterClick(e,storyCategory,"storyCategories")}
          use_name={true}
        />

        <button onClick={() => this.toggle("storyElementsFilterOpen")} className="button white fbtn" data-toggle="second">Filter with Stories<img src="../../assets/toolkit/images/shape.svg" alt /></button>
        <StoryElementsDropdown
          id="second"
          state={this.state}
          app={this.app_id}
          filterBy={this.state.filterBy}
          style={{top: "43.8984px",left: "-173.367px"}}
          open={this.state.currentDropdown === "storyElementsFilterOpen"}
          handleFilterClick={(e,storyElement) => this.handleFilterClick(e,storyElement,"storyElements")}
          use_name={true}
        />

        <button onClick={() => this.toggle("appVersionsFilterOpen")} className="button white fbtn" data-toggle="third">Filter by versions<img src="/assets/toolkit/images/shape.svg" alt /></button>
        <AppVersionsDropdown
          id="third"
          use_name={true}
          state={this.state}
          app={this.app_id}
          filterBy={this.state.filterBy}
          open={this.state.currentDropdown === "appVersionsFilterOpen"}
          style={{top: "43.8984px",left: "-171.773px"}}
          handleFilterClick={(e,appVersion) => this.handleFilterClick(e,appVersion,"appVersions")}
        />  
        </div>



                  </div>
                </div>
              </div>
            <div style={{position:"inline"}}>
              </div>
                            <div>
                              {BELOW_HEADER}
                              <div className="cards">
                                <div className="container">
                                  <div className="cards__content">
                                  <center>
                                      {
                                        !this.state.stories ? null : this.state.stories.map((story,i) => {
                                          return (
                                            <Link to={{
                                              pathname: `/story/${story.id}`,
                                              state: { from_app: this.app_id, stories: this.state.stories, index: i }
                                            }}>
                                              <img style={{ height: 450,width: 230, borderRadius: '25px' }} src={story.thumbnail.url} />
                                            </Link>
                                          );
                                        })
                                      }
                                      {
                                  this.state.show_loading ? <Loading/> : null
                                      }

                                {
                                  this.state.reached_end || this.state.show_loading
                                    ? <h3></h3>
                                    : <h3 onClick={() => if_user_call_func(this.props.user, () => this.updateResults(true), this.setState.bind(this))}>Load more</h3>
                                }
                                  </center>
                                  </div>
                                </div>
                              </div>
                </div>
                      </div>
                    </div>
                  </div>
          )
        }
      </div>
    </div>
		);
	}
}

export default compose(withApollo, withRouter)(_SingleApp);