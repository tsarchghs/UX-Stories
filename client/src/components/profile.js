import React from "react";
import LibraryCard from "./libraryCard";
import Loading from "./loading";
import Header from "./header";
import { withApollo, Query,ApolloProvider } from "react-apollo";
import EditProfileModal from "./editProfileModal";
import CreateLibraryModal from "./createLibraryModal";
import EditLibraryModal from "./editLibraryModal";
import DeleteLibraryModal from "./deleteLibraryModal";
import { LIBRARIES_QUERY } from "../Queries";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: undefined,
      profile_photo: this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo.url : undefined,
      jobs: undefined,
      editProfile_open: false,
      editLibrary:{
        id: undefined,
        name: undefined
      },
      deleteLibrary:{
        id: undefined,
        name: undefined
      },
      currentDropDownOpen: undefined
    }
    this.refetchLibraries = undefined;
    this.editProfile = undefined;
    this.closeModal = this.closeModal.bind(this);
    this.openLibraryModal = this.openLibraryModal.bind(this);
    this.updateLibraryNameOnChange = this.updateLibraryNameOnChange.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
  }
  closeModal(){
    this.setState({ currentModal: undefined })
  }
  openLibraryModal(type,modalName,library){
    this.setState({
      [type]: {
        id: library.id,
        name: library.name
      },
      currentModal: modalName
    })
  }
  updateLibraryNameOnChange(type,e){
    let target = e.target;
    this.setState(nextState => {
      nextState[type].name = target.value
      return nextState;
    })
  }
  toggleDropDown(value) {
    this.setState(prevState => {
      let last_value = prevState["currentDropdown"];
      prevState["currentDropdown"] = last_value === value ? undefined : value
      console.log(last_value,55,value)  
      return prevState;
    })
  }
  render() {
    return (
      <ApolloProvider client={this.props.client}>
      <div>
        <EditProfileModal
          user={this.props.user}
          modalIsOpen={this.state.currentModal === "EditProfileModal"}
          refetchApp={this.props.refetchApp}
          closeModal={this.closeModal}
          closeAndUpdate={() => {
            this.props.refetchApp()
          }}
        />
        <CreateLibraryModal
          modalIsOpen={this.state.currentModal === "CreateLibraryModal"}
          closeModal={this.closeModal}
        />
        <EditLibraryModal
          modalIsOpen={this.state.currentModal === "EditLibraryModal"}
          closeModal={this.closeModal}
          id={this.state.editLibrary.id}
          name={this.state.editLibrary.name}
          onChange={(e) => this.updateLibraryNameOnChange("editLibrary",e)}
        />
        <DeleteLibraryModal
            modalIsOpen={this.state.currentModal === "DeleteLibraryModal"}
            closeModal={this.closeModal}
            id={this.state.deleteLibrary.id}
            name={this.state.deleteLibrary.name}
            onChange={(e) => this.updateLibraryNameOnChange("deleteLibrary", e)}
        />
      <Header 
        user={this.props.user} 
        opened={this.state.currentDropdown === "profileDropdown"}
        toggleOpened={() => this.toggleDropDown("profileDropdown")}
        closeDropdown={() => this.setState({currentDropdown:undefined})}
      />
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
                                    maxHeight:100,
                                    backgroundSize: "cover"
                                }} />
                                <div className="flex fd-column jc-se">
                                  <h2>{this.props.user.full_name}</h2>
                                  <p className="light-gray">{this.props.user.job ? this.props.user.job.name : "None"}</p>
                                </div>
                              </div>  
                              <button 
                                style={{display:"none"}}
                                className="button">Save</button>

                              <button 
                                ref={node => this.editProfile = node}
                                onClick={() => this.setState({currentModal:"EditProfileModal"})}
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
                  query={LIBRARIES_QUERY}
                  >
                  { ({loading,error,data,refetch,networkStatus}) => {
                    this.refetchLibraries = refetch;
                    if (error) return <p>{error.message}</p>
                    var data_or_cache = data
                    if (!data.libraries){
                      try {
                        var data_or_cache = this.props.client.readQuery({query:LIBRARIES_QUERY});
                      } catch (e) {}
                    }
                    let libraries = data_or_cache.libraries ? data_or_cache.libraries : []
                    return (
                        <div className="libraries__content">
                          {
                            loading && !libraries.length? <Loading/>
                            : 
                            <div className="libraries__content">
                              <div onClick={() => {
                                this.setState({
                                  currentModal: "CreateLibraryModal"
                                })
                              }} className="libraries-card create">
                                <img src="../../assets/toolkit/images/007-plus.svg" />
                                <p className="pink bold">Create new library</p>
                              </div>
                              {
                                libraries.map(library => {

                                  return <LibraryCard 
                                      openLibraryModal={this.openLibraryModal} 
                                      key={library.id}
                                      library={library}

                                    />
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