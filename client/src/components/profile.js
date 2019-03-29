import React from "react";
import LibraryCard from "./libraryCard";
import gql from "graphql-tag";
import Loading from "./loading";
import Header from "./header";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      libraries: undefined,
      user_profile: this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo : undefined,
      user_profile_onClick: undefined
    }
  }
  async componentDidMount() {
    console.log(this.props);
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
            createLibrary(createLibraryInput:{
              name:"${libraryName}"
            }) 
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
  profileOnMouseEnter() {
    this.setState({
      user_profile:"https://cdn3.iconfinder.com/data/icons/glypho-photography/64/camera-upload-to-512.png"
    })
  }
  profileOnMouseLeave(){
    this.setState({
      user_profile: this.props.user && this.props.user.profile_photo ? this.props.user.profile_photo : undefined
    })
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
                                  onMouseEnter={() => this.profileOnMouseEnter()} 
                                  onMouseLeave={() => this.profileOnMouseLeave()} 
                                  onClick={this.state.user_profile_onClick}
                                  className="user-profile__img" style={{
                                  backgroundImage: (
                                    `url(${this.state.user_profile ? this.state.user_profile : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"})`
                                    ),
                                  maxWidth:100,
                                  maxHeight:100
                                }} />
                                <div className="flex fd-column jc-se">
                                  <h2>{this.props.user.first_name} {this.props.user.last_name}</h2>
                                  <p className="light-gray">Senior UX Designer</p>
                                </div>
                              </div>  <button className="button">Edit Profile</button>
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

export default Profile;