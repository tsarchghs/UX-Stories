import React from "react";
import { Query, Mutation, withApollo } from "react-apollo";
import { handleUploadPhotoInput } from "../helpers";
import Alert from "./alert";
import Modal from 'react-modal';
import { JOBS_QUERY, EDIT_PROFILE_MUTATION, GET_LOGGED_IN_USER_QUERY } from "../Queries";
import Loading from "./loading";

const customStyles = {
	content: {
		top: '370px',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: "368px",
		borderRadius: "6px",
		outline: "none"
	},
	overlay: {
		backgroundColor: "rgba(10, 10, 10, 0.75)"
	}
};

Modal.setAppElement('#root')

class _EditProfileModal extends React.Component {
	constructor(props) {
		super(props);
		this.uploadPhotoInput = undefined;
		this.full_name = undefined;
		this.job = undefined;
		this.email = undefined;
		this.state = {}
		if (props.user){
			this.state = {
				full_name: props.user.full_name,
				email: props.user.email,
				job: props.user.job,
				password: undefined
			}
		}
	}
	componentWillMount(){
		this.props.client.query({ query: JOBS_QUERY })
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.user && !this.state.user) {
			this.setState({
				full_name: nextProps.user.full_name,
				email: nextProps.user.email,
				job: nextProps.user.job,
				password: undefined
			})
		}
	}
	render(){
		return (
			<Modal
				isOpen={this.props.modalIsOpen}
				onAfterOpen={this.props.afterOpenModal}
				onRequestClose={this.props.closeModal}
				style={customStyles}
				contentLabel="Example Modal"
			>
		      <div id={this.props.id}>
		      	<Query
		      		query={JOBS_QUERY}>
		      	{ ({loading,error,data}) => {
		      		let query_loading = loading
		      		let jobs = data && data.jobs ? data.jobs : []
		      		return (
		      			<Mutation
		      				mutation={EDIT_PROFILE_MUTATION}>
			      			{ (editProfile,{loading,error,data}) => {
								return (
									<form id="edit_profile" onSubmit={async (e) => {
										e.preventDefault();
										if (loading) return;
										let job = this.state.job
										if (!job){
											let res = await this.props.client.query({query:JOBS_QUERY})
											job = res.data.jobs[0]
										}
										let variables = {
											full_name: this.state.full_name,
											job: job.id,
											email: this.state.email,
											password: this.state.password
										}
										if (this.uploadPhotoInput && this.uploadPhotoInput.base64){
											variables["profile_photo"] = {
												createWithBase64: {
													base64: this.uploadPhotoInput.base64,
													mimetype: "image/png"
												}
											}
										}
										let data = await editProfile({variables})
										// let cache = this.props.client.readQuery({
										// 	query: GET_LOGGED_IN_USER_QUERY
										// })
										// let user = cache.getLoggedInUser;
										// user.full_name = this.state.full_name
										// user.job = {
										// 	...this.state.job,
										// 	__typename: "Library"
										// }
										// user.profile_photo = data.data.editProfile.profile_photo
										// user.email = this.state.email
										// user.password = this.state.password
										// user.profile_photo = 
										// this.props.client.writeQuery({
										// 	query: GET_LOGGED_IN_USER_QUERY,
										// 	data: JSON.parse(JSON.stringify(cache))
										// })
										this.props.closeAndUpdate && this.props.closeAndUpdate()
										this.props.closeModal && this.props.closeModal()
									}}>
								          <h3 className="modal__title">Edit profile</h3>
								          {
								          	false
								          	? 

								          	(
												<div id="loadingProfile">
										          <center>
										          	<p>dsadsd</p>
										            <img src="/assets/toolkit/images/logo.svg" alt /><br />
										            <img src="https://loading.io/spinners/rolling/lg.curve-bars-loading-indicator.gif" />
										          </center>
										        </div>
								          	)
								          	:
								          	(
								          		<div>
														{
															error && error.graphQLErrors && error.graphQLErrors[0].name === "ValidationError" && error.graphQLErrors[0].data.errors.map(error => <Alert style={{ height: 50 }} red={true} message={error} />)
														}
										          <div className="modal__content">
										            <div className="modal__upload">
										              <img id="profile_image" className="modal__img" src={`${this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"}`} />
										              <input 
										              	ref={node => this.uploadPhotoInput = node} 
										              	type="file" 
										              	id="uploadPhotoInput" hidden 
										              	onChange={() => handleUploadPhotoInput(this.uploadPhotoInput)}
										              />
										              <button 
										              	type="button" 
										              	id="uploadPhotoButton" 
										              	className="button naked smaller"
										              	onClick={() => this.uploadPhotoInput.click()}
										              >
										              		Upload photo
													  </button>
										            </div>
										            <div className="modal__form">
										              <p className="bold">Personal</p>
										              <input 
										              	className="input" 
										              	id="p_full_name" 
										              	type="text" 
										              	placeholder="First and last name" 
																		value={this.state.full_name}
																		onChange={e => this.setState({ full_name: e.target.value })}	
										              />
										              <div className="select__div">
																	<select id="p_job" onChange={e => this.setState({ job: { id: e.target.value, name: e.target.id } })}>
										                {
										                	jobs.map(job => {
										                		return (
											                		<option 
											                			id={job.name} 
											                			value={job.id}
											                			selected={this.state.job === job.id}
											                		>
											                			{job.name}
											                		</option> 
											                	)
										                	})
										                }
										                </select>
										              </div>
										            </div>
										            <div className="modal__form">
										              <p className="bold">Account</p>
										              <input 
										              	className="input" 
										              	id="p_email" 
										              	type="email"
														readOnly={this.props.user.google_accessToken} 
										              	placeholder="Email" 
										              	value={this.state.email}
																		onChange={e => this.setState({ email: e.target.value })}	
										              />
										              <input 
										              	className="input" 
										              	id="p_password" 
										              	type="password" 
										              	autoComplete="false" 
										              	placeholder="New password" 
										              	value={this.state.password}
																		onChange={e => this.setState({ password: e.target.value ? e.target.value : undefined })}								              
										              />
										            </div>
										          </div>
										          <div className="text-right">
												  {
													  loading ? <Loading noCenter={true} style={{width: 45,textAlign:"right"}}/> : 
										            	<button className="button smaller">Update profile</button>
												  }
										          </div>
										          <button 
													ref={node => this.closeEditProfileRef = node} 
													id="closeEditProfile"
													className="close-button"
													onClick={e => {
														this.closeEditProfileRef.parentElement.parentElement.parentElement.parentElement.click()
													}} 
													type="button"
												>
										            <img onClick={this.props.closeModal} src="../../assets/toolkit/images/006-error.svg" alt />
										          </button>
									          </div>
								          	)
								          }
								    </form>
								)
			      			}}
		      			</Mutation>
		      		);  
		      	}}
			  </Query>
		    </div>
			</Modal>
		)
	}
}

export default withApollo(_EditProfileModal);