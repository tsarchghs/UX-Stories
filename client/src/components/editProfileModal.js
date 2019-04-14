import React from "react";
import ReactDOM from "react-dom";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { handleUploadPhotoInput } from "../helpers";

class EditProfileModal extends React.Component {
	constructor(props) {
		super(props);
		this.uploadPhotoInput = undefined;
		this.full_name = undefined;
		this.job = undefined;
		this.email = undefined;
	}
	render(){
		return (
			ReactDOM.createPortal(
		      <div className="modal reveal" id={this.props.id} data-reveal>
		      	<Query
		      		query={gql`
				        query {
				          jobs {
				            id
				            name
				          }
				        }
		      	`}>
		      	{ ({loading,error,data}) => {
		      		if (error) return <p>{error.message}</p>
		      		let query_loading = loading
		      		let jobs = data && data.jobs ? data.jobs : []
		      		console.log(jobs);
		      		return (
		      			<Mutation
		      				mutation={gql`
		      					mutation EditProfile(
		      						$full_name: String
		      						$job: ID
		      						$email: String
		      						$profile_photo: FileInput
		      					){
		      						editProfile(
		      							full_name: $full_name
		      							job: $job
		      							email: $email
		      							profile_photo: $profile_photo 
		      						) {
		      							id
		      						}
		      					}
		      			`}>
			      			{ (editProfile,{loading,error,data}) => {
								return (
									<form id="edit_profile" onSubmit={async (e) => {
										e.preventDefault();
										let variables = {
											full_name: this.full_name.value,
											job: this.job.value,
											email: this.email.value
										}
										if (this.uploadPhotoInput && this.uploadPhotoInput.base64){
											variables["profile_photo"] = {
												base64: this.uploadPhotoInput.base64,
												mimetype: "image/png"
											}
										}
										let data = await editProfile({variables})
										this.props.closeAndUpdate()
										// this.props.refetchApp();
										// if (document.querySelector('body > div:nth-child(6)')){
										// 	document.querySelector('body > div:nth-child(6)').click()
										// }
										// console.log(data)
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
										              	ref={node => {
										              		this.full_name = node
										              		if (this.full_name) this.full_name.value = this.props.user.full_name
										              	}}
										              />
										              <div className="select__div">
										                <select ref={node => this.job = node} id="p_job">
										                {
										                	jobs.map(job => {
										                		return (
											                		<option 
											                			id={job.name} 
											                			value={job.id}
											                			selected={this.props.user.job.id === job.id}
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
										              	placeholder="Email" 
										              	value={this.props.user.email}
										              	ref={node => {
										              		this.email = node
										              		if (this.email) this.email.value = this.props.user.email
										              	}}										              
										              />
										              <input 
										              	className="input" 
										              	id="p_password" 
										              	type="password" 
										              	autoComplete="false" 
										              	placeholder="New password" 
										              	ref={node => this.password = node}											              
										              />
										            </div>
										          </div>
										          <div className="text-right">
										            <button className="button smaller">Update profile</button>
										          </div>
										          <button id="closeEditProfile" className="close-button" data-close aria-label="Close reveal" type="button">
										            <img src="../../assets/toolkit/images/006-error.svg" alt />
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
		    ,document.body)
		)
	}
}

export default EditProfileModal;