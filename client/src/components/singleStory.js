import React from "react";
import SingleStoryAppLoading from "./singleStoryAppLoading";
import { Link, withRouter } from "react-router-dom";
import DropdownLoading from "./dropdownLoading";
import Loading from "./loading";
import { withApollo, ApolloProvider, Query, Mutation } from "react-apollo";
import InsideHeader from "./insideHeader";
import CreateLibraryModal from "./createLibraryModal";
import { if_user_call_func } from "../helpers";
import { compose } from "recompose";
import { 
	LIBRARIES_QUERY_SHALLOW,
	TOGGLE_STORY_LIBRARY_MUTATION,
	STORY_QUERY,
	LIBRARIES_QUERY
} from "../Queries";
import PickMembershipModal from "./pickMembershipModal";
import E404 from "./E404";
import { toast } from 'react-toastify';

class SingleStory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			app: props.app ? props.app : undefined,
			storyCategories: undefined,
			storyElements: undefined,
			selectedLibraries: [],
			savingStory: false,
			story: undefined,
			selectLibraryOpen: false,
			not_found: false
		}
		this.story_id = undefined;
		this.toggleSelectLibrary = this.toggleSelectLibrary.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		let param_id = this.props.match.params.id
		if (param_id[param_id.length - 1] === "#") {
			this.story_id = param_id.slice(0, param_id.length - 1);
		} else {
			this.story_id = param_id
		}
	}
	toggleSelectLibrary() {
		this.setState(prevState => {
			let state = prevState
			state.selectLibraryOpen = !state.selectLibraryOpen
			return state;
		})
	}
	async componentDidMount() {
		console.log("MOUNTED",this.state.app)
		if (!this.state.app) {
			let data = await this.props.client.query({
				query: STORY_QUERY,
				variables: { id: this.story_id }
			})
			console.log(data.data.story);
			if (!data.data.story){
				this.setState({
					not_found: true
				})
			} else {
				this.setState({
					app: data.data.story.app,
					storyElements: data.data.story.storyElements,
					storyCategories: data.data.story.storyCategories,
					video: data.data.story.video.file,
					story: data.data.story
				})
			}
		}
	}
	onCloseModal(){
		this.setState({ currentModal: undefined, selectLibraryOpen: true }, () => {
			this.setState({ selectLibraryOpen: true })
		})
	}
	async updateLibrariesQueryCache(action,library){
		try {
			let cache2 = this.props.client.readQuery({
				query: LIBRARIES_QUERY
			})
			console.log("cache2", cache2);
			if (action === "connect") {
				for (var x in cache2.libraries) {
					let lib = cache2.libraries[x];
					if (lib.id === library.id) {
						lib.stories.push(this.state.story)
						break;
					}
				}
			} else if (action === "disconnect") {
				for (var x in cache2.libraries) {
					let lib = cache2.libraries[x];
					if (lib.id === library.id) {
						lib.stories = lib.stories.filter(story => story.id !== this.story_id)
						break;
					}
				}
			}
			this.props.client.writeQuery({
				query: LIBRARIES_QUERY,
				data: JSON.parse(JSON.stringify({ libraries: [...cache2.libraries] }))
			})
		} catch (e) { console.log(e) }
	}
	async updateShallowLibrariesQueryCache(action,library){
		try {
			let cache = this.props.client.readQuery({
				query: LIBRARIES_QUERY_SHALLOW,
				variables: { libraryFilterInput: { containsStory: this.story_id } }
			})
			console.log("cache",this.props.client);
			if (action === "connect") {
				let new_library = {
					__typename: "Library",
					id: library.id,
					name: library.name
				}
				cache.libraries.push(new_library);
			} else if (action === "disconnect") {
				cache.libraries = cache.libraries.filter(x => x.id !== library.id)
			}
			this.props.client.writeQuery({
				query: LIBRARIES_QUERY_SHALLOW,
				variables: { libraryFilterInput: { containsStory: this.story_id } },
				data: JSON.parse(JSON.stringify({ libraries: [...cache.libraries] }))
			})
		} catch (e) { console.log(e) }
	}
	render() {
		// let params = getQueryParams(window.location.href);
		// let redirect_back = this.state.app ? `/app/${this.state.app.id}` : "#"
		// if (params["from"] === "stories"){
		// 	redirect_back = "/stories";
		// }
		let back_to_path = "/stories";
		let state = {}
		if (this.props.location.state){
			if (this.props.location.state.from_app){
				back_to_path = `/app/${this.props.location.state.from_app}`
			} else if (this.props.location.state.from_library){
				back_to_path = `/library/${this.props.location.state.library_id}`
			} 
			state["filterBy"] = this.props.location.state.filterBy
		}
		if (this.state.not_found) return <E404/>
		return (
			<div>
				<InsideHeader
					back_to_msg={`Back to ${back_to_path && back_to_path.split("/")[1]}`}
					state={state}
					back_to_path={back_to_path}
					user={this.props.user}
				/>
				<CreateLibraryModal
					modalIsOpen={this.state.currentModal === "CreateLibraryModal"}
					closeModal={this.onCloseModal}
				/>
				<PickMembershipModal
					modalIsOpen={this.state.currentModal === "PickMembershipModal"}
					closeModal={(e) => this.setState({ currentModal: undefined })}
				/>
				<div className="inside-stories">
					<div className="inside-stories__container">
						<div className="inside-stories__top">
							{
								!this.state.app ? <SingleStoryAppLoading />
									:
									<div className="apps__top">
									<Link to={`/app/${this.state.app.id}`}>
										<div className="apps__top-image" style={{ backgroundImage: `url("${this.state.app.logo.url}")` }} />
									</Link>
										<div className="apps__top-info">
											<Link to={`/app/${this.state.app.id}`}>
												<h5 className="bold">{this.state.app.name}</h5>
											</Link>	
											<p className="apps__small-title light-gray">{this.state.app.description}</p>
										</div>
									</div>
							}
							{
								this.state.app
									? <Link to={`/app/${this.state.app.id}`}>
										<p className="pink">See other stories</p>
									</Link>
									: <a href="#"><p className="pink">See other stories</p></a>
							}
						</div>
						<div className="inside-stories__hero">
							<div className="inside-stories__video">
								{
									!this.state.video
										? <img style={{ borderRadius: 25, width: 230 }} src="/assets/toolkit/images/loadingVideo.png" />
										: <video style={{ borderRadius: 25 }} controls width="230" height="500" autoPlay>

											<source style={{ borderRadius: 10 }} src={this.state.video.url}
												type={this.state.video.mimetype} />
										</video>
								}
							</div>
							<div className="inside-stories__info">
								<div className="inside-stories__card">
									<div className="inside-stories__card--inside">
										<p className="bold">Screens</p>
										{
											this.state.storyCategories && !this.state.storyCategories.length
												? <p>Nothing to show</p>
												: ""
										}
										{
											!this.state.storyCategories ?
												<div>
													<img style={{ paddingRight: 5 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII=" />
													<img style={{ paddingRight: 5 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII=" />
													<img style={{ paddingRight: 5 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII=" />
												</div>
												: this.state.storyCategories.map(storyCategory => {
													return (
														<div className="ux-label no-close">
															<p className="light-gray">{storyCategory.name}</p>
															<span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
														</div>
													);
												})
										}
									</div>
									<div className="inside-stories__card--inside">
										<p className="bold">Elements</p>
										{
											this.state.storyElements && !this.state.storyElements.length
												? <p>Nothing to show</p>
												: ""
										}
										{
											!this.state.storyElements ?
												<div>
													<img style={{ paddingRight: 5 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII=" />
													<img style={{ paddingRight: 5 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII=" />
													<img style={{ paddingRight: 5 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII=" />
												</div>
												: this.state.storyElements.map(storyElement => {
													return (
														<div className="ux-label no-close">
															<p className="light-gray">{storyElement.name}</p>
															<span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
														</div>
													);
												})
										}
									</div>
									<hr />
									<div className="inside-stories__card--share">
										<p className="bold">Share</p>
										<div>
											<a href="#"><img src="/assets/toolkit/images/fb.svg" alt /></a>
											<a href="#"><img src="/assets/toolkit/images/twt.svg" alt /></a>
											<a href="#"><img src="/assets/toolkit/images/pt.svg" alt /></a>
											<a href="#"><img src="/assets/toolkit/images/mail.svg" alt /></a>
										</div>
									</div>
									<hr />
													<div className="inside-stories__card--save">
														<p className="bold">Save to libraries</p>
														<button 
															onClick={() => if_user_call_func(this.props.user,this.toggleSelectLibrary,this.setState.bind(this))}
															className="button">Select library</button>
														<div style={{ top: "16.7344px", left: "-185.391px" }} className={`filter ${this.state.selectLibraryOpen ? "is-open" : ""}`}>
									{
										this.props.user && 
											<Query 
												query={LIBRARIES_QUERY_SHALLOW}
												variables={{
													libraryFilterInput: { containsStory: this.story_id }
												}}
											>
												{ ({loading: loading_top,error,data,refetch} ) => {
													let checked_libraries = []
													if (data && data.libraries) checked_libraries = data.libraries.map(library => library.id)
													let current_librariesQuery_result = data
													return (
														<div>
																	<Query
																		query={LIBRARIES_QUERY_SHALLOW}
																	>
																	{ ({loading,error,data}) => {
																		if (loading) return <DropdownLoading />;
																		return (
																			<div className = "filter-dropdown" >
																				<div className="filter-dropdown__top">
																					<h5 className="gray bold">Save to libraries</h5>
																					<h5 onClick={() => this.setState({ currentModal: "CreateLibraryModal" })} className="gray bold">ADD</h5>
																				</div>
																				<div className="filter-dropdown__main">
																					{
																						this.state.savingStory ? <Loading />
																							: data.libraries.map(library => {
																								let checked = checked_libraries.includes(library.id);
																								return (
																									<Mutation
																										mutation={TOGGLE_STORY_LIBRARY_MUTATION}
																									>
																										{(toggleStoryLibrary, { loading, error, data }) => {
																											let toggleLibrary = async (e) => {
																												if (loading) return;
																												let response = await toggleStoryLibrary({
																													variables: {
																														library: library.id,
																														story: this.story_id
																													}
																												})
																												let action = response.data.toggleStoryLibrary.action;
																												await this.updateShallowLibrariesQueryCache(action,library);
																												await this.updateLibrariesQueryCache(action,library);
																												this.setState(this.state)
																												if (action === "connect"){
																													toast.success(`Saved story to library ${library.name}`)
																												} else if (action === "disconnect"){
																													toast.error(`Removed story to library ${library.name}`)
																												}
																											}
																											let backgroundColor;
																											if (loading) {
																												backgroundColor = "#d3d3d3"
																											} else {
																												if (checked) backgroundColor = "rgba(199, 88, 117, 0.22)"
																											}
																											return (
																												<label
																													className={`radio__container ${checked ? "checked" : ""}`}
																													style={{ backgroundColor }}
																												>

																													<label id={library.id + "_label"} className="gray bold">{library.name}</label>
																													<input
																														className="ic"
																														type="checkbox"
																														name={library.name}
																														value={library.id}
																														checked={checked}
																														onChange={toggleLibrary}
																													/>
																													<span className="checkmark" />
																												</label>
																											)
																										}}

																									</Mutation>
																								);
																							})
																					}
																				</div>
																			</div>
																			)
																		}}

																	</Query>
																}
														</div>
													)
												}}
											</Query>

									}
														</div>
													</div>
								</div>
								<div className="inside-stories__card small">
									<a target="_blank" href="http://www.hudhud.io">
										<p className="bold">Sponsored</p>
										<div className="inside-stories__card--sponsored">
											<div className="sponsored-card">
												<img src="/assets/toolkit/images/hdhd.svg" alt />
											</div>
											<p className="light-gray bold">Plan your team’s availabilty and we will estimate when work starts. Also manage projects with stories.</p>
										</div>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(withApollo,withRouter)(SingleStory);