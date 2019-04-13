import React from "react";
import LibraryCard from "./libraryCard";
import gql from "graphql-tag";
import Loading from "./loading";
import Header from "./header";
import { withApollo } from "react-apollo";

const handleUploadPhotoInput = element => {
  var file = element.files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    element.base64 = reader.result
    console.log(reader.result);
    document.getElementById("profile_image").src = reader.result
    document.getElementById("profile_image").changed = true;
  }
  try {
    reader.readAsDataURL(file);
  } catch(e) {
    console.log("Failed to get dataurl");
  }
}


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: undefined,
      profile_photo: this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : undefined,
      jobs: undefined
    }
  }
  async componentDidMount() {
    let uploadPhotoInput = document.getElementById("uploadPhotoInput")
    document.getElementById("uploadPhotoInput").onchange = () => handleUploadPhotoInput(document.getElementById("uploadPhotoInput"));
    document.getElementById("uploadPhotoButton").onclick = () => document.getElementById("uploadPhotoInput").click()
    document.getElementById("edit_profile").onsubmit = async (e) => {
      e.preventDefault();
      document.getElementById("edit_profile").style = "display:none;"
      document.getElementById("loadingProfile").style = "display:block;"

      this.props.updateProfile();
    }
    const jobs = this.props.client.query({
      query: gql`
        query {
          jobs {
            id
            name
          }
        }
      `
    }).then(data => {
      this.setState({
        jobs: data.data.jobs
      })
      document.getElementById("p_job").innerHTML = this.state.jobs.map(job => {
        return `<option id=${job.name} value=${job.id} 
        ${
          job.id === this.props.user.job.id ? "selected" : ""
        }        
        >${job.name}</option>`
      })
      document.getElementById("p_full_name").value = `${this.props.user.full_name}` 
      document.getElementById("profile_image").src = this.state.profile_photo ? this.state.profile_photo : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"
      document.getElementById("p_email").value = this.props.user.email
      document.getElementById("edit_profile").style = "display:block;"
      document.getElementById("loadingProfile").style = "display:none;"
    })
    const result = await this.props.client.query({
        query: gql`
          query {
            libraries {
              id
              name
              stories {
                thumbnail {
                  url
                }
              }
            }
          }
        `
    })
    console.log(result);
    this.setState({
      libraries: result.data.libraries
    })
    document.getElementById("createLibraryButton").onclick = async () => {
      document.getElementById("inside_exampleModal2").style = "display:none;"
      document.getElementById("exampleModal2_loading").style = "display:block;"
      let libraryName = document.getElementById("libraryName").value;
      let data = await this.props.client.mutate({
        mutation: gql`
          mutation {
            createLibrary(
              name:"${libraryName}"
            ) 
            {
              id
              name
              stories {
                thumbnail {
                  url
                }
              }
            }            
          }
        `
      })
      this.setState(prevState => ({
        libraries: prevState.libraries.concat(data.data.createLibrary)
      }));
      document.getElementsByClassName("reveal-overlay")[0].click()
      document.getElementById("inside_exampleModal2").style = "display:block;"
      document.getElementById("exampleModal2_loading").style = "display:none;"
      document.getElementById("libraryName").value = ""
    }
  }
  render() {
    return (
      <div>
      <Header user={this.props.user} />
        <div className="container">
          <div className="profile__content">

              {
                Object.keys(this.props.user).length ? 
                ( 
                  <div className="profile-card">             
                              <div className="user-profile">
                                <div 
                                  className="user-profile__img" style={{
                                  backgroundImage: (
                                    `url(${this.state.profile_photo ? this.state.profile_photo : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"})`
                                    ),
                                  maxWidth:100,
                                  maxHeight:100
                                }} />
                                <div className="flex fd-column jc-se">
                                  <h2>{this.props.user.full_name}</h2>
                                  <p className="light-gray">{this.props.user.job.name}</p>
                                </div>
                              </div>
                              <button onClick={() => this.props.refetchApp()} className="button">Update</button>  
                              <button data-open="editProfile" className="button">Edit Profile</button>
                    </div>
                    ) :
                    ( 
                      <div className="profile-card">             
                         <div className="user-profile">
                          <img src="https://user-images.githubusercontent.com/4838076/34308760-ec55df82-e735-11e7-843b-2e311fa7b7d0.gif" />
                        </div>
                      </div>
                    )
              }
            <div className="libraries">
              <h3 className="text-center">Libraries</h3>
              <div className="libraries__content">
              {
                this.state.libraries === undefined ? 
                (
                  ""
                ) 
                :
                (
                    <div data-open="exampleModal2" className="libraries-card create">
                      <img src="../../assets/toolkit/images/007-plus.svg" />
                      <p className="pink bold">Create new library</p>
                    </div>
                )
              }
                {
                  this.state.libraries === undefined ?
                  (
                    <Loading />
                  )
                  :
                  (
                    this.state.libraries.map(library => {
                        return <LibraryCard key={library.id} library={library} />
                    })

                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default withApollo(Profile);