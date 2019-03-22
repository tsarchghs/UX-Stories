import React from "react";
import Loading from "./loading";
import LibraryHeader from "./libraryHeader";
import gql from "graphql-tag";

class Library extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			library: undefined
		}
	}
	async componentDidMount() {
		try {
			var results = await this.props.client.query({
				query: gql`
					query {
						library(libraryInput:{
							id:"${this.props.match.params.id}"
					  }) {
						id
						name
					    stories {
					      id
					      thumbnail {
					        url
					      }
					    }
					  }
					}
				`
			})
		} catch (e) {
			console.log(e);
		}
		console.log(results);
		this.setState({
			library: results.data.library
		})
	}
	render() {
		return (
			<div>
				<LibraryHeader user={this.props.user} />
				{
			      		this.state.library === undefined ?
						(
							<Loading style={{margin:150}}/>
						)
						:
						(
						<div>
					        <div className="container">
					          <div className="secodary-header__content">
					            <div className="colored">
					              <div className="flex ac">
					                <h2 className="white">{this.state.library.name}</h2>
					              </div>
					              <div className="flex ac">
					                <a href="#"><img src="../../assets/toolkit/images/edit.svg" alt /></a>
					                <div className="filter">
					                  <button className="button white">Filter with Categories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
					                </div>				<div className="filter">
					                  <button className="button white">Filter with Stories<img src="/assets/toolkit/images/008-delete.svg" alt /></button>
					                </div>			</div>
					            </div>
					          </div>
					        </div>
					        <div className="cards">
					          <div className="container">
					            <div className="cards__content">
					            {
					            	this.state.library.stories.length ? "" : <center>{"Nothing to show"}</center>	
					            }
									{
						                this.state.library.stories.map(story => 
						                  <a href="#" key={story.id}><img style={{width:300,height:600}} key={story.id} src={story.thumbnail.url} alt /></a>
						                )
									}
					            </div>
					          </div>
					        </div>
						</div>
						)
				}
				</div>
	    );
	}
}

export default Library;