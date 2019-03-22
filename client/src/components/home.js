import React from "react";
import Loading from "./loading";
import gql from "graphql-tag";
import Header from "./header";

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      stories: undefined
    }
    this.search = this.search.bind(this);
  }
  async componentDidMount() {
    let results = await this.props.client.query({
      query: gql`
        query {
          stories {
            id
            thumbnail {
              url
            }
          }
        }
      `
    })
    let stories = results.data.stories;
    console.log(stories);
    this.setState({
      stories: stories
    })    
  }
  async search(e) {
    this.setState({
      stories: undefined
    })
    let results = await this.props.client.query({
      query: gql`
        query {
          stories(storiesFilterInput:{
            appName_contains:"${e.target.value}"
          }){
            id
            thumbnail {
              url
            }
          }
        }
      `
    })
    let stories = results.data.stories;
    this.setState({
      stories: stories
    })
  }
  render() {
    return (
      <div>
      <Header user={this.props.user} />
        <div className="secondary-header">
          <div className="container">
            <div className="secodary-header__content">
              <div className="flex  ac">
                <h2 className="white">Browse Stories</h2>
                <span className="seperator" />
                <div className="search">
                  <img src="/assets/toolkit/images/search-icon.svg" alt />
                  <input onChange={this.search} type="text" placeholder="Search by app name..." />
                </div>      </div>
              <div className="flex">
                <div className="filter">
                  <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                </div>        <div className="filter">
                  <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                </div>        <div className="filter">
                  <button className="button white">Filter with Elements<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
                </div>      </div>
            </div>
          </div>
        </div>
        <div className="results">
          <div className="container">
            <div className="results__content">
              <p className="results__results bold">Showing {this.state.stories ? this.state.stories.length : 0} Results</p>
              <div className="ux-label ">
                <p className="light-gray">Social networking</p>
                <span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
              </div>      <div className="ux-label ">
                <p className="light-gray">Social networking</p>
                <span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
              </div>      <div className="ux-label ">
                <p className="light-gray">Social networking</p>
                <span><img src="/assets/toolkit/images/008-delete.svg" alt /></span>
              </div>      <p className="pink"><a href="#">Clear all filters</a></p>
            </div>
          </div>
        </div><div className="cards">
          <div className="container">
            <div className="cards__content">
            {
              this.state.stories && !this.state.stories.length ? <center>{"Nothing to show"}</center> : ""
            }
            {
              this.state.stories === undefined ?
              (
                <Loading />
              ) 

              :
              
              (
                this.state.stories.map(story => 
                  <a href="#" key={story.id}><img style={{width:300,height:600}} key={story.id} src={story.thumbnail.url} alt /></a>
                )
              )
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;