import React from "react";
import Loading from "./loading";
import gql from "graphql-tag";
import Header from "./header";
import { Link } from "react-router-dom";
import {getStories,getAppCategories,getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters} from "../helpers";

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stories: undefined,
      appCategories: undefined,
      storyCategories: undefined,
      storyElements: undefined,
      filterBy: {
        appCategory: undefined,
        storyCategories: {},
        storyElements: {}
      }
    }
    this.search = this.search.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }
  async componentDidMount() {
    let stories = await getStories(this.props.client);
    let appCategories = await getAppCategories(this.props.client);
    let storyCategories = await getStoryCategories(this.props.client);
    let storyElements = await getStoryElements(this.props.client);

    this.setState({
      stories: stories,
      appCategories: appCategories,
      storyCategories: storyCategories,
      storyElements: storyElements
    })    
  }
  async search(storyName_contains) {
    this.setState({
      stories: undefined
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
            elements: ${JSON.stringify(filters.storyElements)}
          }) {
            id
            thumbnail {
              url
            }
          }
        }
        `
    })
    let stories = results.data.stories;
    this.setState({
      stories: stories
    })
  }
  async handleFilterClick(e,obj,type) {
    this.setState((prevState) => {
      let state = prevState;
      if (type === "appCategory"){
        state.filterBy.appCategory = obj.id
      } else {
        state = prevState.filterBy[type] = {...prevState.filterBy[type],[obj.id]:!prevState.filterBy[type][obj.id]}
      }
      return state
    },() => this.search(document.getElementById("storyName_contains").value))
  }
  resetFilters(){
    this.setState(prevState => {
      let state = prevState;
      state.filterBy.appCategory = undefined
      state.filterBy.storyCategories = {}
      state.filterBy.storyElements = {}
      console.log(state);
      return state;
    },() => this.search(document.getElementById("storyName_contains").value))
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
    },() => this.search(document.getElementById("storyName_contains").value))
  }
  render() {
    console.log(this.state,122);
    return (
      <div>
      <Header user={this.props.user} />
        {
          !this.state.appCategories || !this.state.storyCategories || !this.state.storyElements ?
          (
            <Loading style={{margin:280}}/>
          )
          :
          
          (
 <div>
          <div className="secondary-header">
            <div className="container">
              <div className="secodary-header__content">
                <div className="flex  ac">
                  <h2 className="white">Browse Stories</h2>
                  <span className="seperator" />
                  <div className="search">
                    <img src="/assets/toolkit/images/search-icon.svg" alt />
                    <input id="storyName_contains" onChange={(e) => this.search(e.target.value)} type="text" placeholder="Search by story..." />
                  </div>      </div>
                <div className="flex">
                  <div className="filter">
                    <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                  </div>        <div className="filter">
                    <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                  </div>        <div className="filter">
                    <button className="button white">Filter with Elements<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                  </div>      </div>
              </div>
            </div>
          </div>
            <div>App Category
            {
              this.state.appCategories.map(appCategory => {
                return (
                  <div>
                    <input 
                      type="radio" 
                      id={appCategory.id} 
                      name={appCategory.name}
                      checked={this.state.filterBy.appCategory === appCategory.id}
                      onClick={async (e) => await this.handleFilterClick(e,appCategory,"appCategory")}
                    />
                      <label id={appCategory.id+"_label"} htmlFor="huey">{appCategory.name}</label>
                  </div>
                );
              })
            }
          <hr/>
            <div style={{position:"inline"}}>
                <p>Stories:</p>
                {
                  this.state.storyCategories.map(storyCategory => {
                    return (
                      <div style={{position:"inline"}}>
                        <input 
                          type="checkbox" 
                          id={storyCategory.id} 
                          name={storyCategory.name}
                          onClick={async (e) => await this.handleFilterClick(e,storyCategory,"storyCategories")}
                          checked={this.state.filterBy.storyCategories[storyCategory.id]}
                        />
                        <label id={storyCategory.id+"_label"}  htmlFor="scales">{storyCategory.name}</label>
                      </div>
                    );
                  })
                }
              </div>
              <hr/>
            <div style={{position:"inline"}}>
                <p>Elements:</p>
                  {
                    this.state.storyElements.map(storyElement => {
                      return (
                        <div style={{position:"inline"}}>
                          <input 
                            type="checkbox" 
                            id={storyElement.id} 
                            name={storyElement.name}
                            onClick={async (e) => await this.handleFilterClick(e,storyElement,"storyElements")}
                            checked={this.state.filterBy.storyElements[storyElement.id]}
                           />
                          <label id={storyElement.id+"_label"}  htmlFor="scales">{storyElement.name}</label>
                        </div>
                      )
                    })
                  }
              </div>
          <div>
        </div>
          <div className="results">
            <div className="container">
              <div className="results__content">
                <p className="results__results bold">Showing {this.state.stories ? this.state.stories.length : 0} Results</p>
                {
                  this.state.filterBy.appCategory ? 
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
                {
                  getActiveFilters(this.state,"storyCategories").map(storyCategory => {
                      return (
                        <div className="ux-label ">
                          <p className="light-gray">{document.getElementById(storyCategory+"_label").innerHTML}</p>
                          <span><a href="#"><img onClick={() => this.unFilter("storyCategories",storyCategory)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                        </div>  
                      );    
                  })                
                }
              {
                getActiveFilters(this.state,"storyElements").map(storyElement => {
                    return (
                      <div className="ux-label">
                        <p className="light-gray">{document.getElementById(storyElement+"_label").innerHTML}</p>
                        <span><a href="#"><img onClick={() => this.unFilter("storyElements",storyElement)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
                      </div>  
                    );    
                 })
              }
              {
                !(this.state.filterBy.appCategory || getActiveFilters(this.state,"storyElements").concat(getActiveFilters(this.state,"storyCategories")).length) ?  "" :
                  <p onClick={this.resetFilters} className="pink"><a href="#">Clear all filters</a></p>
              }
              </div>
            </div>
          </div><div className="cards">
            <div className="container">
              <div className="cards__content">
              {
                this.state.stories && !this.state.stories.length ? <center>{"Nothing to show"}</center> : ""
              }
              {
                this.state.stories === undefined ?
                (
                  <Loading />
                ) 

                :
                
                (
                  this.state.stories.map(story => 
                      <a href="#" key={story.id}><img style={{borderRadius:30,width:300,height:600}} key={story.id} src={story.thumbnail.url} alt /></a>
                  )
                )
              }
              </div>
            </div>
          </div>
        </div>
      </div>
          )
        }
      </div>
    );
  }
};

export default Home;