import React from "react";
import Header from "./header";
import Loading from "./loading";
import gql from "graphql-tag";
import {getStories,getAppVersions,getAppCategories,getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters} from "../helpers";
import E404 from "./E404";
import AppProfileLoading from "./appProfileLoading";
import StoryThumbnailLoading from "./storyThumbnailLoading";
import SingleAppLoading from "./singleAppLoading";
import { debounce } from "lodash";
import DropdownLoading from "./dropdownLoading";
import { Link } from "react-router-dom";
import { withApollo, Query } from "react-apollo";
import StoryCategoriesDropdown from "./storyCategoriesDropdown";
import StoryElementsDropdown from "./storyElementsDropdown";
import StoryElementsActiveFilters from "./storyElementsActiveFilters";
import AppVersionsDropdown from "./appVersionsDropdown";

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
      show_stories_skeleton: false,
      show404: false
    }
    this.skip = 0
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.getFormattedFilterBy = this.getFormattedFilterBy.bind(this);
    if (this.props.match.params.id[this.props.match.params.id.length-1] === "#"){
      this.app_id = this.props.match.params.id[this.props.match.params.id.length-1]
    } else {
      this.app_id = this.props.match.params.id
    }
  }
	async componentDidMount(){
    let app = await this.props.client.query({
      query: gql`
        query {
          app(id:"${this.app_id}"){
            id
            name
            description
            company
            appVersions { 
              id
              name
            }
            appCategory {
              id
              name
            }
            logo {
              id
              url
            }
          }
        }
      `
    })
    this.skip += 10;
    if (!app.data.app){
      this.setState({
        show404: true
      })
      return;
    }
    this.setState({
      app: app.data.app
    })
  }
  async handleFilterClick(e,type) {
    console.log(e.target,type);
    this.skip = 0
    let id = e.target.id
    await this.setState(prevState => {
      let state = prevState
      state.show_stories_skeleton = true
      state.reached_end = false
      state.stories = undefined
      console.log(state["filterBy"],type);
      state["filterBy"][type][id] = !state["filterBy"][type][id]
      return state
    })
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
      state.reached_end = false
      state.stories = undefined
      state.show_stories_skeleton = true
      state.filterBy.storyCategories = {}
      state.filterBy.storyElements = {}
      state.filterBy.appVersions = {}      
      return state
    });
  }
  unFilter(type,obj){
    this.skip = 0
    this.setState(prevState => {
      let state = prevState;
      state.reached_end = false
      state.stories = undefined
      state.show_stories_skeleton = true
      state.filterBy[type][obj] = false;
      return state;
    });
  }
  toggle(name) {
    this.setState(nextState => {
      nextState[name] = !nextState[name]
      return nextState;
    })
  }
	render(){
    if (this.state.app){
      var len = this.state.app.appVersions.length;
      var current_version;
      if (!len) current_version = "None";
      else current_version = this.state.app.appVersions[len-1].name 
    }
    if (this.state.show404) return <E404 />

		return (
      <div>
        <div className="header back__header">
	      <Header user={this.props.user} />
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
            <div>
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
          open={this.state.storyCategoriesFilterOpen}
          handleFilterClick={(e,storyCategory) => this.handleFilterClick(e,"storyCategories")}
        />

        <button onClick={() => this.toggle("storyElementsFilterOpen")} className="button white fbtn" data-toggle="second">Filter with Stories<img src="../../assets/toolkit/images/shape.svg" alt /></button>
        <StoryElementsDropdown
          id="second"
          state={this.state}
          app={this.app_id}
          filterBy={this.state.filterBy}
          style={{top: "43.8984px",left: "-173.367px"}}
          open={this.state.storyElementsFilterOpen}
          handleFilterClick={(e,storyElement) => this.handleFilterClick(e,"storyElements")}
        />

        <button onClick={() => this.toggle("appVersionsFilterOpen")} className="button white fbtn" data-toggle="third">Filter by versions<img src="/assets/toolkit/images/shape.svg" alt /></button>
        <AppVersionsDropdown
          id="third"
          state={this.state}
          app={this.app_id}
          filterBy={this.state.filterBy}
          open={this.state.appVersionsFilterOpen}
          style={{top: "43.8984px",left: "-171.773px"}}
          handleFilterClick={(e,appVersion) => this.setState(prevState => {
            let state = prevState;
            let status = !state.filterBy.appVersions[appVersion.id]
            state.filterBy.appVersions = {[appVersion.id] : status}
            return state;
          })}
        />  
        </div>



                  </div>
                </div>
              </div>
            <div style={{position:"inline"}}>
              </div>
                      <Query
                        query={gql`
                          query Stories(
                            $storiesFilterInput: StoriesFilterInput
                          ) {
                            stories(
                              storiesFilterInput: $storiesFilterInput
                            ) {
                              id
                              thumbnail {
                                id
                                url
                              }
                            }
                          }
                        `}
                          notifyOnNetworkStatusChange={true}
                          variables={{
                            storiesFilterInput: { ...this.getFormattedFilterBy(), app: this.app_id, first: 10 } 
                          }}
                      >
                        {({ loading, error, data, fetchMore, networkStatus }) => {
                          console.log(networkStatus);
                          const BELOW_HEADER = (
                            <div className="results">
                              <div className="container">
                                <div className="results__content">
                                  <p className="results__results bold">Showing {data && data.stories ? data.stories.length : 0} Results</p>
                                  {
                                    Object.keys(this.state.filterBy).map(type_ => {
                                      return getActiveFilters(this.state, type_).map(obj => {
                                        console.log(this.state, type_)
                                        console.log(obj);
                                        return (
                                          <div className="ux-label ">
                                            <p className="light-gray">{document.getElementById(obj + "_label").innerHTML}</p>
                                            <span><a href="#"><img onClick={() => this.unFilter(type_, obj)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                                          </div>
                                        );
                                      })
                                    }).flat()
                                  }
                                  <hr />
                                  <br />

                                  {
                                    Object.keys(getActiveFilters(this.state, "storyCategories")).length ||
                                      Object.keys(getActiveFilters(this.state, "storyElements")).length ||
                                      Object.keys(getActiveFilters(this.state, "appVersions")).length
                                      ? <a href="#"><p onClick={() => this.resetFilters()} className="pink">Clear all filters</p></a>
                                      : ""
                                  }
                                </div>
                              </div>
                            </div>
                          )
                          if (networkStatus === 1) {
                            return (
                              <div>
                                {BELOW_HEADER}
                                <div className="cards">
                                  <div className="container">
                                    <div className="cards__content">
                                      <StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading />
                                      <StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading />
                                      <StoryThumbnailLoading /><StoryThumbnailLoading />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          if (error) return <p>{error.message}</p>
                          let stories = data.stories;
                          if (!stories.length){
                            return <center><p>Nothing to show</p></center>
                          }
                          return (
                            <div>
                              {BELOW_HEADER}
                              <div className="cards">
                                <div className="container">
                                  <div className="cards__content">
                                    {
                                      stories.map(story => {
                                        return (
                                          <Link to={`/story/${story.id}`}>
                                            <img style={{ height: 350,width:160, borderRadius: '25px' }} src={story.thumbnail.url} />
                                          </Link>
                                        );
                                      })
                                    }
                                  </div>
                                </div>
                              </div>
                              <center>
                                {
                                  this.state.reached_end
                                  ? <p>Reached the end</p>
                                  : (
                                      networkStatus === 3 ? <div>
                                        <div className="cards">
                                          <div className="container">
                                            <div className="cards__content">
                                              <StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading />
                                              <StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading /><StoryThumbnailLoading />
                                              <StoryThumbnailLoading /><StoryThumbnailLoading />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      : <button onClick={() => {
                                            console.log(stories.length);
                                            fetchMore({
                                              variables: { 
                                                storiesFilterInput: {
                                                  ...this.getFormattedFilterBy(), skip: stories.length, first: 10, app: this.app_id
                                                  }
                                              },
                                              updateQuery: (prev, { fetchMoreResult }) => {
                                                let updated_stories = prev.stories;
                                                updated_stories = updated_stories.concat(fetchMoreResult.stories);
                                                console.log(fetchMoreResult.stories, fetchMoreResult.stories.length);
                                                if (fetchMoreResult.stories.length < 10){
                                                  this.setState({
                                                    reached_end: true
                                                  })
                                                }
                                                return { stories: updated_stories };
                                              }  
                                            })
                                        }}>Load more</button>
                                  )
                                }
                              </center>
                            </div>
                          )
                        }}


                    </Query>
              </div></div>
              </div>
          )

        }
      </div>
    </div>
		);
	}
}

export default withApollo(_SingleApp);