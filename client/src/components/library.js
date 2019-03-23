import React from "react";
import Loading from "./loading";
import LibraryHeader from "./libraryHeader";
import gql from "graphql-tag";
import {getStoryCategories,getStoryElements} from "../helpers";

class Library extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			library: undefined,
		    storyCategories: undefined,
		    storyElements: undefined,
		    filterBy: {
		        storyCategories: {},
		        storyElements: {}
	      }
		}
		this.handleFilterClick = this.handleFilterClick.bind(this);
		this.update = this.update.bind(this);
	}
	async componentDidMount() {
		try {
			var results = await this.props.client.query({
				query: gql`
					query {
						library(libraryInput:{
							id:"${this.props.match.params.id}"
					  }) {
						id
						name
						stories {
						  id
						  thumbnail {
							url
						  }
						}
					  }
					}
				`
			})
		    let storyCategories = await getStoryCategories(this.props.client);
		    let storyElements = await getStoryElements(this.props.client);
		    this.setState({
		    	storyCategories,
		    	storyElements
		    })
		} catch (e) {
			console.log(e);
		}
		console.log(results);
		this.setState({
			library: results.data.library
		})
	}
	async handleFilterClick(e,obj,type) {
		this.setState(prevState => {
			let state = prevState;
			state.library.stories = undefined;
			return state;
		})
	      if (type === "storyElements") {
	        var dict = this.state.filterBy.storyElements; 
	      } else if (type === "storyCategories") {
	        var dict = this.state.filterBy.storyCategories;
	      } 
	      if (dict[obj.id] === undefined){
	        dict[obj.id] = false;
	      }
	      console.log(obj,145);
	      if (!dict[obj.id]){
	        this.setState((prevState) => {
	          let state = prevState.filterBy[type] = {...prevState.filterBy[type],[obj.id]:true}
	          return state
	        },this.update)
	      } else {
	        this.setState((prevState) => {
	          let state = prevState.filterBy[type] = {...prevState.filterBy[type],[obj.id]:false}
	          return state
	        },this.update)
	      }
	  }
	async update() {
	    var storyCategories = [];
	    for (var key in this.state.filterBy.storyCategories) {
	      if (this.state.filterBy.storyCategories[key]){
	        storyCategories.push(key);
	      }
	    }
	    var elements = [];
	    for (var key in this.state.filterBy.storyElements) {
	      if (this.state.filterBy.storyElements[key]){
	        elements.push(key);
	      }
	    }
		let results = await this.props.client.query({
			query: gql`
				query {
					stories(storiesFilterInput:{
				    inLibrary:"cjtljmt7dtft20b91aj1our7n"
		            storyCategories: ${JSON.stringify(storyCategories)}
		            elements:${JSON.stringify(elements)}
				  }){
				      id
				      thumbnail {
				      	url
				  	}
				}
			}
			`
		})
		this.setState(prevState => {
			let state = prevState;
			state.library.stories = results.data.stories;
			return state;
		})
		console.log(this.state.library);
	}
	render() {
		return (
			<div>
				<LibraryHeader user={this.props.user} />
				{
						this.state.library === undefined || !this.state.storyCategories || !this.state.storyElements ?
						(
							<Loading style={{margin:150}}/>
						)
						:
						(
						<div>
							<div className="container">
							  <div className="secodary-header__content">
								<div className="colored">
								  <div className="flex ac">
									<h2 className="white">{this.state.library.name}</h2>
								  </div>
								  <div className="flex ac">
									<a href="#"><img src="../../assets/toolkit/images/edit.svg" alt /></a>
									<div className="filter">
									  <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
									</div>              <div className="filter">
									  <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
									</div>          </div>
								</div>
							  </div>
							</div>
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
                        <label htmlFor="scales">{storyCategory.name}</label>
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
                            onClick={async (e) => await   this.handleFilterClick(e,storyElement,"storyElements")}
                            checked={this.state.filterBy.storyElements[storyElement.id]}
                           />
                          <label htmlFor="scales">{storyElement.name}</label>
                        </div>
                      )
                    })
                  }
              </div>
			{
				this.state.library.stories === undefined ? 

				(
					<Loading style={{margin:150}}/>
				)
				:
				
				(
							<div className="cards">
							  <div className="container">
								<div className="cards__content">
								{
									this.state.library.stories.length ? "" : <center>{"Nothing to show"}</center>   
								}
									{
										this.state.library.stories.map(story => 
										  <a href="#" key={story.id}><img style={{borderRadius:30,width:300,height:600}} key={story.id} src={story.thumbnail.url} alt /></a>
										)
									}
								</div>
							  </div>
							</div>
				)
			}
						</div>
						)
				}
				</div>
		);
	}
}

export default Library;