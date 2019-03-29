import React from "react";
import Header from "./header";
import Loading from "./loading";
import gql from "graphql-tag";
import {getStories,getAppCategories,getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters} from "../helpers";
import E404 from "./E404";

class SingleApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      app: undefined,
      stories: undefined,
      storyCategories: undefined,
      storyElements:undefined,
      filterBy: {
        storyCategories: {},
        storyElements: {},
        appVersions:{}
      },
      show404: false
    }
    this.handleFilterClick.bind(this);
    this.resetFilters.bind(this);
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
              url
            }
            category { 
              name
            }
            stories {
              id
              thumbnail {
                url
              }
            }
            versions {
              id
              version
            }
          }
        }
      `
    })
    if (!app.data.app){
      this.setState({
        show404: true
      })
      return;
    }
    let storyElements = await getStoryElements(this.props.client);
    let storyCategories = await getStoryCategories(this.props.client);
    this.setState({
      app: app.data.app,
      stories: app.data.app.stories,
      storyElements,
      storyCategories
    })
  }
  async handleFilterClick(e,type) {
    this.setState({
      stories: undefined
    })
    let id = e.target.id
    await this.setState(prevState => {
      let state = prevState
      state["filterBy"][type][id] = !state["filterBy"][type][id]
      return state
    },this.updateStories)
  }
  async updateStories(){
    if (this.state.stories){
      this.setState({
        stories: undefined
      })
    }
    let filters = {"storyCategories":[],"appVersions":[],"storyElements":[]};
    filters = insertActiveFilters(filters,this.state);
    let data = await this.props.client.query({
      query:gql`
        query {
          stories(storiesFilterInput:{
            app:"${this.state.app.id}"
            appVersions:${JSON.stringify(filters.appVersions)}
            storyCategories:${JSON.stringify(filters.storyCategories)}
            elements:${JSON.stringify(filters.storyElements)}
          }) {
            id
            thumbnail {
              url
            }
          }
        }
      `
    })
    this.setState({
      stories: data.data.stories
    })
  }
  resetFilters() {
    this.setState({
      filterBy: {
        storyCategories: {},
        storyElements: {},
        appVersions:{}
      }
    },this.updateStories);
  }
  unFilter(type,obj){
    if (this.state.stories){
      this.setState({
        stories: undefined
      })
    }
    this.setState(prevState => {
      let state = prevState;
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
            this.state.show404 ? "" : <Loading/>
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
              <h5 className="bold">{this.state.app.category.name}</h5>
              <span className="horisontal-seperator" />
              <p className="light-gray">Current version</p>
              <h5 className="bold">{this.state.app.versions[this.state.app.versions.length - 1].version}</h5>
            </div>
            <div>
              <div className="container">
                <div className="secodary-header__content">
                  <div className="colored">
                    <div className="flex ac">
                      <div className="filter">
                        <button className="button white">Filter with stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                      </div>        <div className="filter">
                        <button className="button white">Filter with elements<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                      </div>        <div className="filter">
                        <button className="button white">Version of apps<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                      </div>      </div>
                  </div>
                </div>
              </div>
            <div style={{position:"inline"}}>
                <p>Stories:</p>
                { 
                  (!this.state.storyCategories || !this.state.storyElements) ? <Loading/> :
                      (    
                          this.state.storyCategories.map(storyCategory => {
                            return (
                              <div style={{position:"inline"}}>
                                <input 
                                  type="checkbox" 
                                  id={storyCategory.id} 
                                  name={storyCategory.name}
                                  checked={this.state.filterBy["storyCategories"][storyCategory.id] !== undefined && this.state.filterBy["storyCategories"][storyCategory.id]}
                                  onChange={(e) => this.handleFilterClick(e,"storyCategories")}
                                />
                                <label id={storyCategory.id+"_label"}  htmlFor="scales">{storyCategory.name}</label>
                              </div>
                            );
                          })
                      )
                      .concat(<p>Elements:</p>)
                      .concat(

                          this.state.storyElements.map(storyElement => {
                                                      return (
                                                        <div style={{position:"inline"}}>
                                                          <input 
                                                            type="checkbox" 
                                                            id={storyElement.id}
                                                            checked={this.state.filterBy["storyElements"][storyElement.id] !== undefined && this.state.filterBy["storyElements"][storyElement.id]}
                                                            onChange={(e) => this.handleFilterClick(e,"storyElements")}
                                                            name={storyElement.name}
                                                          />
                                                          <label id={storyElement.id+"_label"}  htmlFor="scales">{storyElement.name}</label>
                                                        </div>
                                                      );
                          })

                      )
                      .concat(<p>App Versions</p>)
                      .concat(


                          this.state.app.versions.map(version => {
                                                      return (
                                                        <div style={{position:"inline"}}>
                                                          <input 
                                                            type="checkbox" 
                                                            id={version.id} 
                                                            name={version.version}
                                                            checked={this.state.filterBy["appVersions"][version.id] !== undefined && this.state.filterBy["appVersions"][version.id]}
                                                            onChange={(e) => this.handleFilterClick(e,"appVersions")}
                                                          />
                                                          <label id={version.id+"_label"}  htmlFor="scales">{version.version}</label>
                                                        </div>
                                                      );
                                        })
                      )
                }

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
              </div>      <div className="cards">
                <div className="container">
                  <div className="cards__content">
                {

                  !this.state.stories ? <Loading/>

                  :

                  (
                    this.state.stories.map(story => {
                      return (
                        <a href="#"><img src={story.thumbnail.url} alt /></a>
                      );
                    })
                  )

                }

                  </div>
                </div>
              </div>
              </div></div></div>
          )

        }
      </div>
    </div>
		);
	}
}

export default SingleApp;