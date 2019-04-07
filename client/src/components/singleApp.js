import React from "react";
import Header from "./header";
import Loading from "./loading";
import gql from "graphql-tag";
import {getStories,getAppVersions,getAppCategories,getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters,loadToolkit} from "../helpers";
import E404 from "./E404";
import AppProfileLoading from "./appProfileLoading";
import StoryThumbnailLoading from "./storyThumbnailLoading";
import CategoriesLoading from "./categoriesLoading";
import SingleAppLoading from "./singleAppLoading";
import { debounce } from "lodash";
import DropdownLoading from "./dropdownLoading";
import { Link } from "react-router-dom";

class SingleApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      app: undefined,
      stories: undefined,
      storyCategories: undefined,
      storyElements:undefined,
      appVersions:undefined,
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
    this.resetFilters = this.resetFilters.bind(this);
    this.updateStories = debounce(this.updateStories.bind(this),500)
  }
  async componentDidUpdate(){
    if (!(!this.state.storyCategories || !this.state.storyElements || !this.state.appVersions)) {
      loadToolkit()
    }
  }
	async componentDidMount(){
    if (this.props.match.params.id[this.props.match.params.id.length-1] === "#"){
      this.props.match.params.id = this.props.match.params.id[this.props.match.params.id.length-1]
    }
    let app = await this.props.client.query({
      query: gql`
        query {
          app(id:"${this.props.match.params.id}"){
            id
            name
            description
            company
            logo {
              id
              url
            }
            appCategory {
              id  
              name
            }
            stories(first:10) {
              id
              thumbnail {
                id
                url
              }
            }
            appVersions {
              id
              name
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
    let storyElements = await getStoryElements(this.props.client);
    let storyCategories = await getStoryCategories(this.props.client);
    let appVersions = await getAppVersions(this.props.client);
    this.setState({
      app: app.data.app,
      stories: app.data.app.stories,
      storyElements,
      appVersions,
      storyCategories,
      reached_end: app.data.app.stories.length < 10
    })
  }
  async handleFilterClick(e,type) {
    this.skip = 0
    let id = e.target.id
    await this.setState(prevState => {
      let state = prevState
      state.show_stories_skeleton = true
      state.stories = undefined
      state["filterBy"][type][id] = !state["filterBy"][type][id]
      return state
    },this.updateStories)
  }
  async updateStories(){
    if (this.state.stories){
      this.setState({
        show_stories_skeleton: true
      })
    }
    let filters = {"storyCategories":[],"appVersions":[],"storyElements":[]};
    filters = insertActiveFilters(filters,this.state);
    let data = await this.props.client.query({
      query:gql`
        query {
          stories(storiesFilterInput:{
              first: 10
              skip: ${this.skip}
              app:"${this.state.app.id}"
              appVersions:${JSON.stringify(filters.appVersions)}
              storyCategories:${JSON.stringify(filters.storyCategories)}
              storyElements:${JSON.stringify(filters.storyElements)}
          }) {
            id
            thumbnail {
              id
              url
            }
          }
        }
      `
    })
    this.skip += 10
     this.setState(prevState => {
      let state = prevState
      if (!state.stories){
        state.stories = []
      }
      state.stories = state.stories.concat(data.data.stories)
      state.show_stories_skeleton = false
      state.reached_end = data.data.stories.length < 10
      return state;
    })
  }
  resetFilters() {
    this.skip = 0
    this.setState(prevState => {
      let state = prevState;
      state.stories = undefined
      state.show_stories_skeleton = true
      state.filterBy.storyCategories = {}
      state.filterBy.storyElements = {}
      state.filterBy.appVersions = {}      
      return state
    },this.updateStories);
  }
  unFilter(type,obj){
    this.skip = 0
    this.setState(prevState => {
      let state = prevState;
      state.stories = undefined
      state.show_stories_skeleton = true
      state.filterBy[type][obj] = false;
      return state;
    },this.updateStories);
  }
	render(){
		return (
      <div>
        <div className="header back__header">
	      <Header user={this.props.user} />
        {
          this.state.show404 ? <E404/> : ""
        }
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
                <h5 className="bold">{this.state.app.appVersions[this.state.app.appVersions.length - 1].name}</h5>
              </div>
            <div>
              <div className="container">
                <div className="secodary-header__content">
                  <div className="colored">

      <div className="flex">
        <button className="button white fbtn" data-toggle="first">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>
        <div className="filter" id="first" data-dropdown data-auto-focus="true">

            {
              !this.state.storyCategories ? <DropdownLoading/>
              : <div>
                      <div className="filter-dropdown">
                        <div className="filter-dropdown__top">
                          <h5 className="gray bold">Filter by stories</h5>
                          <p className="pink">3 selected</p>
                        </div>
                    {
                    this.state.storyCategories.map(storyCategory => {
                        return (
                          <div className="filter-dropdown__main">
                            <label className="radio__container">
                              <p id={storyCategory.id+"_label"} className="gray bold">{storyCategory.name}</p>
                              <input 
                                id={storyCategory.id} 
                                className="ic" 
                                type="checkbox" 
                                onClick={(e) => this.handleFilterClick(e,"storyCategories")}
                              />
                              <span className="checkmark" />
                            </label>
                          </div>
                        );
                    })
                  }
                  </div>
                </div> 
            }

        </div>
        <button className="button white fbtn" data-toggle="second">Filter with Stories<img src="/assets/toolkit/images/shape.svg" alt /></button>
        <div className="filter" id="second" data-dropdown data-auto-focus="true">
            {
              !this.state.storyElements ? <DropdownLoading/>
              : <div>
                      <div className="filter-dropdown">
                        <div className="filter-dropdown__top">
                          <h5 className="gray bold">Filter by stories</h5>
                          <p className="pink">3 selected</p>
                        </div>
                    {
                    this.state.storyElements.map(storyElement => {
                        return (
                          <div className="filter-dropdown__main">
                            <label className="radio__container">
                              <p id={storyElement.id+"_label"} className="gray bold">{storyElement.name}</p>
                              <input 
                                id={storyElement.id} 
                                className="ic" 
                                type="checkbox" 
                                onClick={(e) => this.handleFilterClick(e,"storyElements")}
                              />
                              <span className="checkmark" />
                            </label>
                          </div>
                        );
                    })
                  }
                  </div>
                </div> 
            }
        </div>

        <button className="button white fbtn" data-toggle="third">Filter by versions<img src="/assets/toolkit/images/shape.svg" alt /></button>
        <div className="filter" id="third" data-dropdown data-auto-focus="true">
          
        {
          !this.state.appVersions ? <DropdownLoading/>
          : <div>
                  <div className="filter-dropdown">
                    <div className="filter-dropdown__top">
                      <h5 className="gray bold">Filter by versions</h5>
                      <p className="pink">3 selected</p>
                    </div>
                {
                this.state.appVersions.map(appVersion => {
                    return (
                      <div className="filter-dropdown__main">
                        <label className="radio__container">
                          <p id={appVersion.id+"_label"} className="gray bold">{appVersion.name}</p>
                          <input 
                            id={appVersion.id} 
                            className="ic" 
                            type="checkbox" 
                            onClick={(e) => this.handleFilterClick(e,"appVersions")}
                          />
                          <span className="checkmark" />
                        </label>
                      </div>
                    );
                })
              }
              </div>
            </div> 
        }



        </div>
      </div>


                  </div>
                </div>
              </div>
            <div style={{position:"inline"}}>
              </div>
              <div className="results">
                <div className="container">
                  <div className="results__content">
                    <p className="results__results bold">Showing {this.state.stories && this.state.stories.length !== undefined ? this.state.stories.length : 0} Results</p>
                {
                  Object.keys(this.state.filterBy).map(type_ => {
                    return getActiveFilters(this.state,type_).map(obj => {
                        return (
                          <div className="ux-label ">
                            <p className="light-gray">{document.getElementById(obj+"_label").innerHTML}</p>
                            <span><a href="#"><img onClick={() => this.unFilter(type_,obj)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                          </div>  
                        );    
                    })
                  }).flat()     
                }
              <hr/>
                    <br/>     

                    {
                      Object.keys(getActiveFilters(this.state,"storyCategories")).length ||  
                      Object.keys(getActiveFilters(this.state,"storyElements")).length || 
                      Object.keys(getActiveFilters(this.state,"appVersions")).length 
                      ? <a href="#"><p onClick={() => this.resetFilters()} className="pink">Clear all filters</p></a>
                      : ""
                    }
                  </div>
                </div>
              </div>      
              <div className="cards">
                <div className="container">
                  <div className="cards__content">
                {

                  !this.state.stories ? ""

                  :

                  (
                    this.state.stories.map(story => {
                      return (
                        <Link to={`/story/${story.id}?from=app`}>
                          <img style={{borderRadius: '25px'}} src={story.thumbnail.url}/>
                        </Link>
                      );
                    })
                  )

                }
                  </div>
                </div>
              </div>
              {
                this.state.show_stories_skeleton || !this.state.stories ? 
                      <div className="cards">
                        <div className="container">
                          <div className="cards__content">
                            <StoryThumbnailLoading/><StoryThumbnailLoading/><StoryThumbnailLoading/><StoryThumbnailLoading/>
                            <StoryThumbnailLoading/><StoryThumbnailLoading/><StoryThumbnailLoading/><StoryThumbnailLoading/>
                            <StoryThumbnailLoading/><StoryThumbnailLoading/>                          
                          </div>
                        </div>
                      </div>
                : ""
              }
              <center>
                {
                  this.state.reached_end
                  ? <p>Reached the end</p>
                  : <button onClick={this.updateStories}>Load more</button>
                }
              </center>
              </div></div>
              </div>
          )

        }
      </div>
    </div>
		);
	}
}

export default SingleApp;