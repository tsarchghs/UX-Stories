import React from "react";
import Loading from "./loading";
import gql from "graphql-tag";
import Header from "./header";
import { Link } from "react-router-dom";
import {getStories,getAppCategories,getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters,loadToolkit} from "../helpers";
import uuidv1 from 'uuid/v1';
import { debounce } from "lodash";
import DropdownLoading from "./dropdownLoading";
import { withApollo } from "react-apollo";
import AppCategoriesDropdown from "./appCategoriesDropdown";
import StoryCategoriesDropdown from "./storyCategoriesDropdown";
import StoryElementsDropdown from "./storyElementsDropdown";
import StoryCategoriesActiveFitlers from "./storyCategoriesActiveFitlers";
import StoryElementsActiveFilters from "./storyElementsActiveFilters";

class _Stories extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stories: undefined,
      appCategories: undefined,
      storyCategories: undefined,
      storyElements: undefined,
      filterBy: {
        appCategory: undefined,
        storyCategories: [],
        storyElements: []
      },
      searchId: undefined
    }
    this.search = debounce( this.search.bind(this), 500 );
    this.resetFilters = this.resetFilters.bind(this);
    this.once = false
    this.allCategoriesFilterClickOnce = false
    this.searchNode = undefined
  }
  componentDidUpdate(){
    loadToolkit()
  }
  hasActiveFitlers(){
    console.log(this.state.filterBy)
    return (this.state.filterBy.appCategory && !(this.state.filterBy.appCategory === "all")) || 
          (this.state.filterBy.storyCategories && this.state.filterBy.storyCategories.length) ||
          (this.state.filterBy.storyElements && this.state.filterBy.storyElements.length)
  }
  async componentDidMount() {
    loadToolkit()
    this.search("",true);
  }
  async search(storyName_contains,first) {
    let searchId = uuidv1();
    this.setState({
      stories: undefined,
      searchId: searchId
    })
    let filters = {"storyCategories":[],"storyElements":[]};
    filters = insertActiveFilters(filters,this.state);
    let results = await this.props.client.query({
      query: gql`
        query {
          stories(storiesFilterInput:{
            storyName_contains:"${storyName_contains}"
            ${this.state.filterBy.appCategory === undefined ? "" : `appCategory: "${this.state.filterBy.appCategory}"`}
            storyCategories: ${JSON.stringify(filters.storyCategories)}
            storyElements: ${JSON.stringify(filters.storyElements)}
          }) {
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
            storyElements {
              id
              name
            }
            thumbnail {
              id
              url
            }
          }
        }
        `
    })
    console.log(this.state.searchId,this.state.searchId === searchId,searchId);
    if (this.state.searchId === undefined || (this.state.searchId === searchId)){
      let stories = results.data.stories;
      this.setState({
        stories: stories
      })
    }
    if (first){
      if (document.getElementById("allCategoriesFilter") && !this.once){
        this.once = true
        document.getElementById("allCategoriesFilter").click()
      }
    }
  }
  async handleFilterClick(e,obj,type) {
    if (!this.allCategoriesFilterClickOnce){
      this.allCategoriesFilterClickOnce = true;
      return;
    }
    this.setState((prevState) => {
      let state = prevState;
      if (type === "appCategory"){
        state.filterBy.appCategory = obj.id
      } else {
        state = prevState.filterBy[type] = {...prevState.filterBy[type],[obj.id]:!prevState.filterBy[type][obj.id]}
        console.log(state);
      }
      return state
    },() => {
      console.log(this.state);
      this.search(this.searchNode.value)})
  }
  resetFilters(){
    this.setState(prevState => {
      let state = prevState;
      state.filterBy.appCategory = undefined
      state.filterBy.storyCategories = []
      state.filterBy.storyElements = []
      console.log(state);
      return state;
    },() => this.search(this.searchNode.value))
  }
  unFilter(type,obj){
    if (this.state.stories){
      this.setState({
        stories: undefined
      })
    }
    this.setState(prevState => {
      let state = prevState;
      if (type === "appCategory"){
        state.filterBy.appCategory = undefined
        return state;
      }
      state.filterBy[type][obj] = false;
      return state;
    },() => this.search(this.searchNode.value))
  }
  render() {
    console.log(this.state,122);
    return (
      <div>
      <Header user={this.props.user} />
        <div>
        <script src="http://uxstories.herokuapp.com//assets/toolkit/scripts/toolkit.js"></script>
          <div className="secondary-header">
            <div className="container">
              <div className="secodary-header__content">
                <div className="flex  ac">
                  <h2 className="white">Browse Stories</h2>
                  <span className="seperator" />
                  <div className="search">
                    <img src="/assets/toolkit/images/search-icon.svg" alt />
                    <input ref={node => this.searchNode = node} onChange={(e) => this.search(e.target.value)} type="text" placeholder="Search by story..." />
                  </div>      </div>
                <div className="flex">
                  { //<div className="filter">
                                          //   <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                                          // </div>        <div className="filter">
                                          //   <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                                          // </div>        <div className="filter">
                                          //   <button className="button white">Filter with Elements<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                                          // </div>
                                        }
        <button className="button white fbtn" data-toggle="first" aria-controls="first" data-is-focus="false" data-yeti-box="first" aria-haspopup="true" aria-expanded="false">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>        
        <AppCategoriesDropdown 
          id="first" 
          filterBy={this.state.filterBy}
          handleAllFilterClick={(e) => this.handleFilterClick(e,{id:"all",name:"all"},"appCategory")}
          handleFilterClick={(e,appCategory) => this.handleFilterClick(e,appCategory,"appCategory")} 
        />

        <button className="button white fbtn" data-toggle="second">Filter with Stories<img src="../../assets/toolkit/images/shape.svg" alt /></button>
        <StoryCategoriesDropdown 
          id="second"
          state={this.state}
          handleFilterClick={(e,storyCategory) => this.handleFilterClick(e,storyCategory,"storyCategories")}
        />

        <button className="button white fbtn" data-toggle="third">Filter with Elements<img src="../../assets/toolkit/images/shape.svg" alt /></button>
        <StoryElementsDropdown
          id="third"
          state={this.state}
          handleFilterClick={(e,storyElement) => this.handleFilterClick(e,storyElement,"storyElements")}
        />

                </div>
              </div>
            </div>
          </div>
            <div>
          <div>
        </div>
          <div className="results">
            <div className="container">
              <div className="results__content">
              {
                !this.hasActiveFitlers() ? null
                : <p className="results__results bold">Showing {this.state.stories ? this.state.stories.length : 0} Results</p>
              }
                {
                  this.state.filterBy.appCategory && this.state.filterBy.appCategory !== "all" ? 
                  (
                        <div className="ux-label ">
                          <p className="light-gray">{document.getElementById(this.state.filterBy.appCategory+"_label").innerHTML}</p>
                          <span><a href="#"><img onClick={() => this.unFilter("appCategory")} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                        </div>  
                  )
                  :
                  (
                    ""
                  )
                }
                  <StoryCategoriesActiveFitlers 
                    state={this.state}
                    unFilter={(e,storyCategory) => this.unFilter("storyCategories",storyCategory)}
                  />
                  <StoryElementsActiveFilters 
                    state={this.state}
                    unFilter={(e,storyElement) => this.unFilter("storyElements",storyElement)}
                  />
              {
                !((this.state.filterBy.appCategory && this.state.filterBy.appCategory !== "all") || getActiveFilters(this.state,"storyElements").concat(getActiveFilters(this.state,"storyCategories")).length) ?  "" :
                  <p onClick={this.resetFilters} className="pink"><a href="#">Clear all filters</a></p>
              }
              </div>
            </div>
          </div><div className="cards">
            <center>
              <div className="container">
                <div className="cards__content">
                {
                  this.state.stories && !this.state.stories.length ? <center>{"Nothing to show"}</center> : ""
                }
                {
                  this.state.stories === undefined ?
                  ( 
                    <div>
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                      <img style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}} src="data:image/png;base64,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" />
                    </div>
                  ) 

                  :
                  
                  (
                    this.state.stories.map(story =>
                      <Link to={`/story/${story.id}`}>
                        <p>appCategory: {story.app.appCategory.name}</p>
                        {
                          story.storyCategories.map(storyCategory => {
                            return <p>StoryCategory: {storyCategory.name}</p>
                          })
                        }
                        {
                          story.storyElements.map(storyElement => {
                            return <p>StoryElement: {storyElement.name}</p>
                          })
                        }
                        <img src={story.thumbnail.url} key={story.id} style={{borderRadius:30,width:250,height:550,marginRight:25,marginBottom:10}}/>
                      </Link> 
                    )
                  )
                }
                </div>
              </div>
            </center>
          </div>
        </div>
      </div>
        }
            <script src="../assets/toolkit/scripts/jquery.min.js"></script>
    <script src="../assets/toolkit/scripts/toolkit.js"></script>
      </div>
    );
  }
};

export default withApollo(_Stories);