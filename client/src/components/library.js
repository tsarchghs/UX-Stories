import React from "react";
import Loading from "./loading";
import InsideHeader from "./insideHeader";
import gql from "graphql-tag";
import {getStoryCategories,getStoryElements,getActiveFilters,insertActiveFilters,loadToolkit} from "../helpers";
import E404 from "./E404";
import DropdownLoading from "./dropdownLoading";
import { withApollo } from "react-apollo";
import StoryCategoriesDropdown from "./storyCategoriesDropdown";
import StoryElementsDropdown from "./storyElementsDropdown";
import StoryCategoriesActiveFitlers from "./storyCategoriesActiveFitlers";
import StoryElementsActiveFilters from "./storyElementsActiveFilters";

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
				<InsideHeader 
					back_to_msg="Back to profile"
					back_to_path="/profile"
					user={this.props.user} 
				/>
				{
					this.state.show404 ? <E404/> : ""

				}
				{
						this.state.show404 || (this.state.library === undefined) ?
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
		        
							        <button className="button white fbtn" data-toggle="second">Filter with Stories<img src="../../assets/toolkit/images/shape.svg" alt /></button>
							        <StoryCategoriesDropdown 
							          id="second"
												library={this.props.match.params.id}
							          state={this.state}
							          handleFilterClick={(e,storyCategory) => this.handleFilterClick(e,storyCategory,"storyCategories")}
							        />

							        <button className="button white fbtn" data-toggle="third">Filter with Elements<img src="../../assets/toolkit/images/shape.svg" alt /></button>
							        <StoryElementsDropdown
							          id="third"
												library={this.props.match.params.id}
							          state={this.state}
							          handleFilterClick={(e,storyElement) => this.handleFilterClick(e,storyElement,"storyElements")}
							        />

								</div>
								</div>
							  </div>
							</div>

				          <div className="results">
					            <div className="container">
					              <div className="results__content">
					                	<p className="results__results bold">Showing {this.state.library.stories ? this.state.library.stories.length : 0} Results</p>
					                	<StoryCategoriesActiveFitlers 
					                		state={this.state}
					                		unFilter={(e,storyCategory) => this.unFilter("storyCategories",storyCategory)}
					                	/>
						                <StoryElementsActiveFilters 
						                	state={this.state}
						                	unFilter={(e,storyElement) => this.unFilter("storyElements",storyElement)}
						                />
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

export default withApollo(Library);