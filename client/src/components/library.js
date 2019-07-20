import React from "react";
import Loading from "./loading";
import InsideHeader from "./insideHeader";
import { getActiveFilters,insertActiveFilters } from "../helpers";
import E404 from "./E404";
import DropdownLoading from "./dropdownLoading";
import { withApollo, Query } from "react-apollo";
import StoryCategoriesDropdown from "./storyCategoriesDropdown";
import StoryElementsDropdown from "./storyElementsDropdown";
import StoryCategoriesActiveFitlers from "./storyCategoriesActiveFitlers";
import StoryElementsActiveFilters from "./storyElementsActiveFilters";
import { Link } from "react-router-dom";
import { LIBRARY_QUERY, STORIES_QUERY } from "../Queries";

class Library extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			queryVariables: {},
			library: undefined,
		    storyCategories: undefined,
		    storyElements: undefined,
		    filterBy: {
		        storyCategories: {},
		        storyElements: {}
	      	},
			show404: false,
			library: {}
		}
		this.toggle = this.toggle.bind(this);
		this.all_stories = undefined;
		this.handleFilterClick = this.handleFilterClick.bind(this);
		this.resetFilters = this.resetFilters.bind(this);
		this.hasFilters = this.hasFilters.bind(this)
	}
	async componentWillUnmount() {
		this.setState(prevState => {
			let state = prevState;
			state.library.stories = this.all_stories;
			return state;
		})
	}
	async componentWillUnmount(){
		console.log(555555555555)
	}
	async componentDidMount() {
		try {
			var results = await this.props.client.query({
				query: LIBRARY_QUERY,
				variables: { id: this.props.match.params.id }
			})
			if (!results.data.library) {
				this.setState({
					show404: true
				})
				return;
			}	
		} catch (e) {
		}
		this.setState(prevState => {
			let stories;
			if (prevState.library){
				stories = prevState.library.stories;
				results.data.library.stories = stories;
			}
			prevState.library = results.data.library;
			return prevState
		})
		this.all_stories = results.data.library;
	}
	async handleFilterClick(e,obj,type) {
		this.setState(prevState => {
			prevState.library.stories = undefined;
			prevState.filterBy[type][`${obj.id}_${obj.name}`] = !prevState.filterBy[type][`${obj.id}_${obj.name}`]
			console.log(prevState.filterBy[type],55);
			return prevState
		})
	}
  toggle(name) {
    this.setState(nextState => {
		nextState.currentDropdown = nextState.currentDropdown === name ? undefined : name
		return nextState;
    })
  }
	unFilter(e,type,obj){
		e.preventDefault()
	    this.setState(prevState => {
	      let state = prevState;
	      state.filterBy[type][obj] = false;
	      return state;
	    });
	  }
	resetFilters(){
	    this.setState(prevState => {
	      let state = prevState;
	      state.filterBy.appCategory = undefined
	      state.filterBy.storyCategories = {}
	      state.filterBy.storyElements = {}
	      return state;
	    });
	  }
	hasFilters(){
		return getActiveFilters(this.state, "storyElements").concat(getActiveFilters(this.state, "storyCategories")).length
	}
	render() {
		if (this.state.show404) return <E404 />
		let filters = { "storyCategories": [], "storyElements": [] };
		filters = insertActiveFilters(filters, this.state, true);
		let variables = {
			storiesFilterInput: {
				inLibrary: this.props.match.params.id,
				storyCategories: filters.storyCategories,
				storyElements: filters.storyElements
			}
		}
		return (
			<div>
				<InsideHeader 
					back_to_msg="Back to profile"
					back_to_path="/profile"
					user={this.props.user} 
				/>
			<div>
				<div className="container">
					<div className="secodary-header__content">
					<div className="colored">
						<div className="flex ac">
						<h2 className="white">{this.state.library.name}</h2>
						</div>
						<div className="flex ac">
						<a href="#"><img src="../../assets/toolkit/images/edit.svg" alt /></a>
	
						<button onClick={e => this.toggle("storyCategoriesFilterOpen")} className="button white fbtn">Filter with Stories<img src="../../assets/toolkit/images/shape.svg" alt /></button>
						<StoryCategoriesDropdown 
							library={this.props.match.params.id}
							filterBy={this.state.filterBy}
							open={this.state.currentDropdown === "storyCategoriesFilterOpen"}
							state={this.state}
							style={{ top: "21.9609px", left: "-173.367px"}}
							handleFilterClick={(e,storyCategory) => this.handleFilterClick(e,storyCategory,"storyCategories")}
							joinID={true}
						/>

						<button onClick={e => this.toggle("storyElementsFilterOpen")} className="button white fbtn">Filter with Elements<img src="../../assets/toolkit/images/shape.svg" alt /></button>
						<StoryElementsDropdown
							library={this.props.match.params.id}
							filterBy={this.state.filterBy}
							open={this.state.currentDropdown === "storyElementsFilterOpen"}
							style={{top: "21.9609px", left: "-188.578px"}}
							state={this.state}
							handleFilterClick={(e,storyElement) => this.handleFilterClick(e,storyElement,"storyElements")}
							joinID={true}
						/>

					</div>
					</div>
					</div>
				</div>

				<div className="results">
					<div className="container">
						<div className="results__content" style={{
							display: this.hasFilters() ? undefined : "none"
						}}>
							<p className="results__results bold">Showing {this.state.library.stories ? this.state.library.stories.length : 0} Results</p>
							<StoryCategoriesActiveFitlers 
								state={this.state}
								unFilter={(e,storyCategory) => this.unFilter(e,"storyCategories",storyCategory)}
								split={true}
							/>
							<StoryElementsActiveFilters 
								state={this.state}
								unFilter={(e,storyElement) => this.unFilter(e,"storyElements",storyElement)}
								split={true}
							/>
							{
								!this.hasFilters() ?  "" :
									<p 
										style={{"cursor":"pointer"}} 
										onClick={this.resetFilters} 
										className="pink"
									>
											Clear all filters
									</p>
							}
						</div>
					</div>
						<Query
							query={STORIES_QUERY}
							variables={variables}
							fetchPolicy="network-only"
						>
							{({loading,error,data}) => {
								if (loading) return <Loading style={{width:250}}/>
								if (error) return error.message
								return (
									<div className="cards">
										<div className="container">
										<div className="cards__content">
										<center>
												{
													data.stories.length ? "" : <center>{"Nothing to show"}</center>   
												}
												{
													data.stories.map((story,i) => 
														<Link to={{
															pathname: `/story/${story.id}`,
															state: {
																from_library: true,
																library_id: this.props.match.params.id,
																stories: data.stories,
																index: i
															}
														}} key={story.id}><img style={{borderRadius:30,width:300,height:600}} key={story.id} src={story.thumbnail.url} alt /></Link>
													)
												}
										</center>
										</div>
										</div>
									</div>

								)
							}}
						</Query>
				</div>
			</div>
		</div>
	)}
}

export default withApollo(Library);