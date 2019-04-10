import React from "react";
import Loading from "./loading";
import LibraryHeader from "./libraryHeader";
import gql from "graphql-tag";
import {getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters,loadToolkit} from "../helpers";
import E404 from "./E404";
import DropdownLoading from "./dropdownLoading";

class Library extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			library: undefined,
		    storyCategories: undefined,
		    storyElements: undefined,
		    filterBy: {
		        storyCategories: [],
		        storyElements: []
	      	},
	      	show404: false
		}
		this.all_stories = undefined;
		this.handleFilterClick = this.handleFilterClick.bind(this);
		this.update = this.update.bind(this);
		this.resetFilters = this.resetFilters.bind(this);
	}
	async componentWillUnmount() {
		this.setState(prevState => {
			let state = prevState;
			state.library.stories = this.all_stories;
			return state;
		})
	}
	async componentDidUpdate(){
		loadToolkit();
	}
	async componentDidMount() {
		loadToolkit();
		try {
			var results = await this.props.client.query({
				query: gql`
					query {
						library(
							id:"${this.props.match.params.id}"
						) {
						id
						name
						stories {
						  id
						  thumbnail {
						  	id
							url
						  }
						}
					  }
					}
				`
			})
			if (!results.data.library) {
				this.setState({
					show404: true
				})
				return;
			}
		    let storyCategories = await getStoryCategories(this.props.client);
		    let storyElements = await getStoryElements(this.props.client);
		    this.setState({
		    	storyCategories,
		    	storyElements
		    })
		} catch (e) {
			console.log(e);
		}
		this.setState({
			library: results.data.library
		})
		this.all_stories = results.data.library;
	}
	async handleFilterClick(e,obj,type) {
		this.setState(prevState => {
			let state = prevState;
			state.library.stories = undefined;
			return state;
		})
		  this.setState((prevState) => {
	      let state = prevState.filterBy[type] = {...prevState.filterBy[type],
	      										[obj.id]:!prevState.filterBy[type][obj.id]}
	      return state
	    },this.update)
	  }
	async update() {
	    let filters = {"storyCategories":[],"storyElements":[]};
	    filters = insertActiveFilters(filters,this.state);
		let results = await this.props.client.query({
			query: gql`
				query {
					stories(storiesFilterInput:{
					    inLibrary:"cjtljmt7dtft20b91aj1our7n"
			            storyCategories: ${JSON.stringify(filters.storyCategories)}
			            storyElements:${JSON.stringify(filters.storyElements)}
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
	}
	unFilter(type,obj){
	    this.setState(prevState => {
	      let state = prevState;
	      state.filterBy[type][obj] = false;
	      return state;
	    },this.update);
	  }
	resetFilters(){
	    this.setState(prevState => {
	      let state = prevState;
	      state.filterBy.appCategory = undefined
	      state.filterBy.storyCategories = {}
	      state.filterBy.storyElements = {}
	      return state;
	    },this.update);
	  }
	render() {
		return (
			<div>
				<LibraryHeader user={this.props.user} />
				{
					this.state.show404 ? <E404/> : ""

				}
				{
						this.state.show404 || (this.state.library === undefined || !this.state.storyCategories || !this.state.storyElements) ?
						(
							this.state.show404 ? "" : <Loading/>
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
		
		<button className="button white fbtn" data-toggle="first" aria-controls="first" data-is-focus="false" data-yeti-box="first" aria-haspopup="true" aria-expanded="false">Filter with Categories<img src="/assets/toolkit/images/shape.svg" alt /></button>        
        <div className="filter" id="first" data-dropdown data-auto-focus="true">
        {
          !(this.state.storyCategories && this.state.storyCategories.constructor === Array) ? <DropdownLoading/>
          : <div className="filter-dropdown">
              <div className="filter-dropdown__top">
                <h5 className="gray bold">Filter with stories</h5>
                <p className="pink">{getActiveFilters(this.state,"storyCategories").length} selected</p>
              </div>
              <div className="filter-dropdown__main">                {
                    this.state.storyCategories.map(storyCategory => {
                      return (
                        <label className="radio__container">
                          <label id={storyCategory.id+"_label"} className="gray bold">{storyCategory.name}</label>
                          <input 
                            className="ic" 
                            type="checkbox" 
                            name={1}
                            value={1}
                            onClick={async (e) => await this.handleFilterClick(e,storyCategory,"storyCategories")}
                          />
                          <span className="checkmark"/>
                        </label>
                      );
                    })
                  }  
              </div>
          </div>
        }     
        </div>
        <button className="button white fbtn" data-toggle="third">Filter with Elements<img src="../../assets/toolkit/images/shape.svg" alt /></button>
        <div className="filter" id="third" data-dropdown data-auto-focus="true">

          {
            !(this.state.storyElements && this.state.storyElements.constructor === Array) ? <DropdownLoading/>
            : <div className="filter-dropdown">
                <div className="filter-dropdown__top">
                  <h5 className="gray bold">Filter with stories</h5>
                  <p className="pink">{getActiveFilters(this.state,"storyElements").length} selected</p>
                </div>
                <div className="filter-dropdown__main">
                    {
                      this.state.storyElements.map(storyElement => {
                        return (
                          <label className="radio__container">
                            <label id={storyElement.id+"_label"} className="gray bold">{storyElement.name}</label>
                            <input 
                              className="ic" 
                              type="checkbox" 
                              name={1}
                              value={1}
                              onClick={async (e) => await this.handleFilterClick(e,storyElement,"storyElements")}
                            />
                            <span className="checkmark"/>
                          </label>
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

				          <div className="results">
					            <div className="container">
					              <div className="results__content">
					                	<p className="results__results bold">Showing {this.state.library.stories ? this.state.library.stories.length : 0} Results</p>
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
						                      <div className="ux-label ">
						                        <p className="light-gray">{document.getElementById(storyElement+"_label").innerHTML}</p>
						                        <span><a href="#"><img onClick={() => this.unFilter("storyElements",storyElement)} src="/assets/toolkit/images/008-delete.svg" alt /></a></span>
						                      </div>  
						                    );    
						                 })
					              }
					              {
					              	!getActiveFilters(this.state,"storyElements").concat(getActiveFilters(this.state,"storyCategories")).length ?  "" :
					                	<p onClick={this.resetFilters} className="pink"><a href="#">Clear all filters</a></p>
					              }
					            	</div>
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
						</div>
			)
		}
		</div>
	)}
}

export default Library;