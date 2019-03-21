import React from "react";
import Library from "./library";
import LibraryCard from "./libraryCard";
import gql from "graphql-tag";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      libraries: []
    }
  }
  async componentDidMount() {
    const result = await this.props.client.query({
        query: gql`
          query {
            libraries {
              id
              name
            }
          }
        `
    })
    this.setState({
      libraries: result.data.libraries
    })
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="profile__content">
            <div className="profile-card">
              <div className="user-profile">
                <div className="user-profile__img" style={{backgroundImage: 'url(https://scontent.fprn1-1.fna.fbcdn.net/v/t1.0-1/p160x160/35988964_1041356179350456_5301902918050381824_n.jpg?_nc_cat=105&_nc_ht=scontent.fprn1-1.fna&oh=2142e132de1a494501a3fc90d51e365c&oe=5D4FB1D7)'}} />
                <div className="flex fd-column jc-se">
                  <h2>Seth Mirsadaj</h2>
                  <p className="light-gray">Senior UX Designer</p>
                </div>
              </div>  <button className="button">Edit Profile</button>
            </div>
            <div className="libraries">
              <h3 className="text-center">Libraries</h3>
              <div className="libraries__content">
                <div data-open="exampleModal2" className="libraries-card create">
                  <img src="../../assets/toolkit/images/007-plus.svg" alt />
                  <p className="pink bold">Create new library</p>
                </div>
                {
                  this.state.libraries.map(library => {
                      return <LibraryCard key={library.id} library={library} />
                  })
                }
              </div>
            </div>
          </div>
        </div>
        {/* This is the first modal */}
        <div className="modal reveal" id="exampleModal2" data-reveal>
          <h3 className="modal__title">Create New library</h3>
          <div>
            <input className="input" type="text" placeholder="Library name" />
          </div>
          <div className="text-right">
            <button className="button">Create</button>
          </div>
          <button className="close-button" data-close aria-label="Close reveal" type="button">
            <img src="../../assets/toolkit/images/006-error.svg" alt />
          </button>
        </div>
        {/* This is the nested modal */}
        <div className=" reveal" id="exampleModal3" data-reveal>
          <h2>ANOTHER MODAL!!!</h2>
          <button className="close-button" data-close aria-label="Close reveal" type="button">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    );
  }
};

export default Profile;