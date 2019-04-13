import React from "react";
import LibraryCard from "./libraryCard";
import gql from "graphql-tag";
import Loading from "./loading";
import Header from "./header";
import { withApollo, Query,ApolloProvider } from "react-apollo";
import EditProfileModal from "./editProfileModal";
import ReactDOM from 'react-dom';
import CreateLibraryModal from "./createLibraryModal";

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
      jobs: undefined,
      editProfile_open: false
    }
    this.refetchLibraries = undefined;
    this.updateButton = undefined;
    this.editProfile = undefined;
  }
  async componentDidMount() {
      ReactDOM.render(
        <ApolloProvider client={this.props.client}>
          <CreateLibraryModal
            id="exampleModal2"
            refetchLibraries={this.props.refetchApp}
            closeAndUpdate={() => {
              if (document.querySelector('body > div:nth-child(11)')){
                document.querySelector('body > div:nth-child(11)').click();
              }
              this.refetchLibraries();
            }}
          />
        </ApolloProvider>,
        document.getElementById("createLibraryModal")
        )
      ReactDOM.render(
        <ApolloProvider client={this.props.client}>
          <EditProfileModal
            id="editProfile"
            user={this.props.user}
            refetchApp={this.props.refetchApp}
            closeAndUpdate={() => {
              if (document.querySelector('body > div:nth-child(12)')){
               document.querySelector('body > div:nth-child(12)').click()
              } 
              this.updateButton.click();
            }}
          />
        </ApolloProvider>,
        document.getElementById("editProfileModal")
    )
  }
  render() {
    console.log(this.props.user);
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
                              <button 
                                style={{display:"none"}}
                                ref={node => this.updateButton = node} 
                                onClick={() => this.props.refetchApp()} 
                                className="button">Save</button>

                              <button 
                                ref={node => this.editProfile = node}
                                data-open="editProfile"
                                className="button">Edit Profile</button>
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
                <Query 
                  query={gql`
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
                  `}>
                  { ({loading,error,data,refetch}) => {
                    this.refetchLibraries = refetch;
                    if (loading) return <Loading />
                    if (error) return <p>{error.message}</p>
                    let libraries = data.libraries;
                    return (
                        <div className="libraries__content">
                          <div data-open="exampleModal2" className="libraries-card create">
                            <img src="../../assets/toolkit/images/007-plus.svg" />
                            <p className="pink bold">Create new library</p>
                          </div>
                          {
                            libraries.map(library => {
                                return <LibraryCard key={library.id} library={library} />
                            })
                          }
                        </div>
                      );
                  }}
                </Query>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default withApollo(Profile);