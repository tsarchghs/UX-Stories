import React from "react";
import LibraryCard from "./libraryCard";
import gql from "graphql-tag";
import Loading from "./loading";
import Header from "./header";
import { withApollo, Query,ApolloProvider } from "react-apollo";
import EditProfileModal from "./editProfileModal";
import ReactDOM from 'react-dom';
import CreateLibraryModal from "./createLibraryModal";
import {loadToolkit} from "../helpers";
import $ from "jquery";
import EditLibraryModal from "./editLibraryModal";
import { LIBRARIES_QUERY } from "../Queries";

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
      loadToolkit();
      ReactDOM.render(
        <ApolloProvider client={this.props.client}>
          <CreateLibraryModal
            id="exampleModal2"
            close={() => {
              document.querySelector('#exampleModal2').parentElement.click()
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
              document.querySelector('#editProfile').parentElement.click()
              this.updateButton.click();
            }}
          />
        </ApolloProvider>,
        document.getElementById("editProfileModal")
    )
  }
  render() {
    loadToolkit()
    console.log(this.props.user);
    return (
      <ApolloProvider client={this.props.client}>
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
                            id
                            thumbnail {
                              id
                              url
                            }
                          }
                        }
                      }
                  `}>
                  { ({loading,error,data,refetch,networkStatus}) => {
                    console.log(networkStatus);
                    this.refetchLibraries = refetch;
                    if (error) return <p>{error.message}</p>
                    var data_or_cache = data
                    if (!data.libraries){
                      try {
                        var data_or_cache = this.props.client.readQuery({query:LIBRARIES_QUERY});
                      } catch (e) {}
                      console.log(data_or_cache,511);
                    }
                    let libraries = data_or_cache.libraries ? data_or_cache.libraries : []
                    console.log(data_or_cache,5123);
                    return (
                        <div className="libraries__content">
                          {
                            loading && !libraries.length? <Loading/>
                            : 
                            <div className="libraries__content">
                              <div data-open="exampleModal2" className="libraries-card create">
                                <img src="../../assets/toolkit/images/007-plus.svg" />
                                <p className="pink bold">Create new library</p>
                              </div>
                              {
                                libraries.map(library => {
                                  let el = document.getElementById(`editLibrary_${library.id}`)
                                  if (!el){
                                    let div = document.createElement("div");
                                    ReactDOM.render(
                                      <ApolloProvider client={this.props.client}>
                                        <EditLibraryModal client={this.props.client} id={library.id} name={library.name} />
                                      </ApolloProvider>
                                      , div)
                                    document.body.appendChild(div);
                                  }
                                  return <LibraryCard key={library.id} library={library} />
                                })
                              }
                            </div>
                          }
                        </div>
                      );
                  }}
                </Query>
            </div>
          </div>
        </div>
      </div>
                  </ApolloProvider>
    );
  }
};

export default withApollo(Profile);