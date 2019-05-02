import React from "react";
import SingleStoryAppLoading from "./singleStoryAppLoading";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import DropdownLoading from "./dropdownLoading";
import Loading from "./loading";
import { withApollo, ApolloProvider } from "react-apollo";
import InsideHeader from "./insideHeader";
import CreateLibraryModal from "./createLibraryModal";
import ReactDOM from 'react-dom';

class SingleStory extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			app: props.app ? props.app : undefined,
			storyCategories: undefined,
			storyElements: undefined,
			selectedLibraries: [],
			savingStory: false,
			selectLibraryOpen: true
		}
		this.story_id = undefined;
		this.selectLibrary = this.selectLibrary.bind(this);
		this.saveToLibraries = this.saveToLibraries.bind(this);
		this.toggleSelectLibrary = this.toggleSelectLibrary.bind(this);
		let param_id = props.match.match.params.id
		if (param_id[param_id.length - 1] === "#"){
			this.story_id = param_id.slice(0,param_id.length-1);
		} else {
			this.story_id = param_id
		}
	}
	toggleSelectLibrary(){
		this.setState(prevState => {
			let state = prevState
			state.selectLibraryOpen = !state.selectLibraryOpen
			console.log(state.selectLibraryOpen);
			return state;
		})
	}
	async componentDidMount(){
		ReactDOM.render(
			<ApolloProvider client={this.props.client}>
				<CreateLibraryModal
					id="singleStoryCreateLibrary"
					refetchLibraries={this.props.refetchApp}
					close={() => {
						document.querySelector('#singleStoryCreateLibrary').parentElement.click()
					}}
				/>
			</ApolloProvider>,
			document.getElementById("createLibraryModal")
		)
		if (!this.state.app){
			console.log(this.story_id,this.props.match.match.params.id)
			let data = await this.props.client.query({
				query: gql`
					query {
						story(id:"${this.story_id}"){
						    id
							app {
								id
								name
								description
								logo {
									id
									url
								}
							}
						    storyElements {
						    	id
						    	name
						    }
						    storyCategories {
						    	id
						    	name
						    }
						    video {
						    	id
						    	file {
						    		id
						    		url
						    		mimetype
						    	}
						    }
					  }
					}
				`
			})
			this.setState({
				app: data.data.story.app,
				storyElements: data.data.story.storyElements,
				storyCategories: data.data.story.storyCategories,
				video: data.data.story.video.file
			},() => console.log(this.state))
			console.log(data);
			console.log(this.props.user);
		}
	}
	selectLibrary(e){
		let library_id = e.target.value;
		this.setState(prevState => {
			let state = prevState
			if (state.selectedLibraries.includes(library_id)){
				state.selectedLibraries = state.selectedLibraries.filter(item => item !== library_id)
			} else {
				state.selectedLibraries.push(library_id);
			}
			console.log(state);
			return state;
		})
	}
	async saveToLibraries(e){
		e.preventDefault()
		this.setState({
			savingStory: true
		})
		let promises = []
		this.state.selectedLibraries.map(library => {
			let promise = this.props.client.mutate({
				mutation: gql`
					mutation {
						editLibrary(id:"${library}",
					  stories:[
					    {
					      type:connect
					      story:"${this.story_id}"
					    }
					  ]) {
					    id
					  }
					}
				`
			})
			promises.push(promise);
		})
		await Promise.all(promises)
		this.setState({
			savingStory: false
		})
	}
	render(){
		// let params = getQueryParams(window.location.href);
		// let redirect_back = this.state.app ? `/app/${this.state.app.id}` : "#"
		// if (params["from"] === "stories"){
		// 	redirect_back = "/stories";
		// }
		return (
			<div>
				<InsideHeader 
					back_to_msg="Back to stories"
					back_to_path="/stories"
					user={this.props.user} 
				/>

				<div className="inside-stories">
			        <div className="inside-stories__container">
			          <div className="inside-stories__top">
			          {
			          	!this.state.app ? <SingleStoryAppLoading/>
			          	: 
			          		<div className="apps__top">
					              <div className="apps__top-image" style={{backgroundImage: `url("${this.state.app.logo.url}")`}} />
					              <div className="apps__top-info">
					                <h5 className="bold">{this.state.app.name}</h5>
					                <p className="apps__small-title light-gray">{this.state.app.description}</p>
					              </div>
						  	</div> 
			          }
			          {
			          	this.state.app 
			          	? <Link to={`/app/${this.state.app.id}`}>
			            	<p className="pink">See other stories</p>
			            </Link>
			            :  <a href="#"><p className="pink">See other stories</p></a>
			          }
			          </div>
			          <div className="inside-stories__hero">
			            <div className="inside-stories__video">
			            {
			            	!this.state.video
			            	? <img style={{borderRadius:25,width: 230}} src="/assets/toolkit/images/loadingVideo.png"/>
			            	: <video style={{borderRadius:25}} controls width="230" height="500" autoPlay>

							    <source style={{borderRadius:10}} src={this.state.video.url}
							            type={this.state.video.mimetype}/>
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
			                  		<img style={{paddingRight:5}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII="/>
			                  		<img style={{paddingRight:5}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII="/>
			                  		<img style={{paddingRight:5}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII="/>
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
			                  		<img style={{paddingRight:5}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII="/>
			                  		<img style={{paddingRight:5}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII="/>
			                  		<img style={{paddingRight:5}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAgCAYAAABTliUJAAAAfUlEQVRoQ+3UsQ3AMAwEMXv/fdUmgEfQtVR/DfHQnZnvuJXAhbdyexG8vR28YAcPXhEIrZ8HLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEgtD14QCKnlwQsCIbU8eEEgpJYHLwiE1PLgBYGQWh68IBBSy4MXBEJqefCCQEh/JfZ8Qf2qHe8AAAAASUVORK5CYII="/>
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
												<a href="#" onClick={this.saveToLibraries}><p className="bold">Save to libraries</p></a>
										<button onClick={this.toggleSelectLibrary} className="button">Select library</button>
										<div style={{top:"16.7344px",left:"-185.391px"}} className={`filter ${this.state.selectLibraryOpen ? "is-open" : ""}`} id="second" data-dropdown data-auto-focus="true">
							        {
							          !this.props.user.libraries ? <DropdownLoading/>
							          : <div className="filter-dropdown">
							              <div className="filter-dropdown__top">
															<h5 className="gray bold">Save to libraries</h5>
															<h5 data-open="singleStoryCreateLibrary" className="gray bold">ADD</h5>
							                <p className="pink">{this.state.selectedLibraries.length} selected</p>
							              </div>
							              <div className="filter-dropdown__main">                
							              {
							              	this.state.savingStory ? <Loading/>
							              	: this.props.user.libraries.map(library => {
							                      return (
							                        <label className="radio__container">
							                          <label id={library.id+"_label"} className="gray bold">{library.name}</label>
							                          <input 
							                            className="ic" 
							                            type="checkbox" 
							                            name={library.name}
							                            value={library.id}
							                            onClick={this.selectLibrary}
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

export default withApollo(SingleStory);