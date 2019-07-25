import React from "react";
import Loading from "./loading";
import InsideHeader from "./insideHeader";
import { getActiveFilters,insertActiveFilters } from "../helpers";
import E404 from "./E404";
import { withApollo, Query } from "react-apollo";
import StoryCategoriesDropdown from "./storyCategoriesDropdown";
import StoryElementsDropdown from "./storyElementsDropdown";
import StoryCategoriesActiveFitlers from "./storyCategoriesActiveFitlers";
import StoryElementsActiveFilters from "./storyElementsActiveFilters";
import { withRouter } from "react-router-dom";
import { LIBRARY_QUERY, STORIES_QUERY_WITH_APP } from "../Queries";
import StoryItem from "./storyItem";
import EditLibraryModal from "./editLibraryModal";
import DeleteLibraryModal from "./deleteLibraryModal";
import { compose } from "recompose";
import gaEvents from "../gaEvents";

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
			library: {},
			editLibrary: {},
			deleteLibrary: {}
		}
		this.toggle = this.toggle.bind(this);
		this.all_stories = undefined;
		this.handleFilterClick = this.handleFilterClick.bind(this);
		this.resetFilters = this.resetFilters.bind(this);
		this.hasFilters = this.hasFilters.bind(this)
		this.updateLibraryNameOnChange = this.updateLibraryNameOnChange.bind(this)
		this.openLibraryModal = this.openLibraryModal.bind(this)
		this.closeModal = this.closeModal.bind(this)
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
	async handleFilterClick(e,obj,type) {
		this.setState(prevState => {
			prevState.library.stories = undefined;
			prevState.filterBy[type][`${obj.id}_${obj.name}`] = !prevState.filterBy[type][`${obj.id}_${obj.name}`]
			console.log(prevState.filterBy[type],55);
			return prevState
		})
	}
	toggle(name) {
		gaEvents.toggle("Library",name)
		this.setState(nextState => {
			nextState.currentDropdown = nextState.currentDropdown === name ? undefined : name
			return nextState;
		})
	}
	unFilter(e,type,obj){
		gaEvents.unFilter("Library",type,obj)
		e.preventDefault()
	    this.setState(prevState => {
	      let state = prevState;
	      state.filterBy[type][obj] = false;
	      return state;
	    });
	  }
	resetFilters(){
		gaEvents.resetFilters("Library")
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
	updateLibraryNameOnChange(type, e) {
		let target = e.target;
		this.setState(nextState => {
			nextState[type].name = target.value
			return nextState;
		})
	}
	closeModal() {
		this.setState({ currentModal: undefined })
	}
	openLibraryModal(type, modalName, library) {
		this.setState({
			[type]: {
				id: library.id,
				name: library.name
			},
			currentModal: modalName
		})
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
				<EditLibraryModal
					gaCategory="Library"
					modalIsOpen={this.state.currentModal === "EditLibraryModal"}
					closeModal={this.closeModal}
					id={this.state.editLibrary.id}
					name={this.state.editLibrary.name}
					onChange={(e) => this.updateLibraryNameOnChange("editLibrary", e)}
				/>
				<DeleteLibraryModal
					gaCategory="Library"
					modalIsOpen={this.state.currentModal === "DeleteLibraryModal"}
					closeModal={(success) => {
						this.closeModal()
						if (success){
							this.props.history.push("/profile")
						}
					}}
					id={this.state.deleteLibrary.id}
					name={this.state.deleteLibrary.name}
					onChange={(e) => this.updateLibraryNameOnChange("deleteLibrary", e)}
				/>
				<Query 
					query={LIBRARY_QUERY}
					variables={{
						id: this.props.match.params.id
					}}
				>
					{({loading,error,data}) => {
						if (error) return "Loading";
						let library = data && data.library ? data.library : { name: "" } 
						return (
							<div>
								<div className="container">
									<div className="secodary-header__content">
									<div className="colored">
										<div className="flex ac">
										<h2 className="white">{library	.name}</h2>
										</div>
										<div onClick={e => {
											if (this.dropDownRef.className.indexOf("close") !== -1){
												this.dropDownRef.className = "show-dropdown";
											} else {
												this.dropDownRef.className = "show-dropdown close";
											}
										}} className="flex ac">
											<div ref={node => this.dropDownRef = node} className="show-dropdown close">
											<img src="../../assets/toolkit/images/edit.svg" className="pop-ed" alt />
												<div className="edit-dropdown" style={{marginRight:546,marginTop:101}}>
													<a onClick={e => {
													e.preventDefault();
													this.openLibraryModal("editLibrary","EditLibraryModal",library)
													}}><img src="../../assets/toolkit/images/edit-p.svg" alt /><p className="bold">Edit</p></a>
												<a href="#" onClick={e => {
													e.preventDefault();
													this.openLibraryModal("deleteLibrary", "DeleteLibraryModal", library)
												}}><img src="../../assets/toolkit/images/edit-p.svg" alt /><p className="bold">Delete</p></a>
												</div>
											</div>	
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
											query={STORIES_QUERY_WITH_APP}
											variables={variables}
											fetchPolicy="network-only"
										>
											{({loading,error,data}) => {
												if (loading) return <Loading style={{width:250}}/>
												if (error) return error.message;
												return (
													<div className="cards">
														<div className="container">
														<div className="cards__content">
														<center>
																{
																	data.stories.length ? "" : <center>{"Nothing to show"}</center>   
																}
																<div class="cards">
																	<div class="container">
																	<div class="cards__content">
																		{
																		data.stories.map((story, i) =>
																			<StoryItem
																				state={{
																					from_library: true,
																					filterBy: this.state.filterBy,
																					stories: data.stories,
																					index: i
																				}}
																				user={this.props.user}
																				story={story}
																				style={{ borderRadius: 30, width: 250, height: 550, marginRight: 25, marginBottom: 10 }}
																			/>
																		)}
																	</div>
																	</div>
																</div>
														</center>
														</div>
														</div>
													</div>

												)
											}}
										</Query>
								</div>
							</div>

						)
					}}	
			</Query>
		</div>
	)}
}

export default compose(withRouter,withApollo)(Library);