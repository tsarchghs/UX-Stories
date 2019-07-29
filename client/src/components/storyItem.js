import React from "react";
import { Mutation, Query, withApollo } from "react-apollo";
import { LIBRARIES_QUERY_SHALLOW, SAVE_TO_LIBRARY_MUTATION } from "../Queries";
import { toast } from 'react-toastify';
import { withRouter } from "react-router-dom";
import { updateShallowLibrariesQueryCache, updateLibrariesQueryCache } from "../cacheModification";
import { compose } from "recompose";
import PickMembershipModal from "./pickMembershipModal"; 

class _StoryItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentModal: undefined
        }
        
    }
    render(){
        return (
            <React.Fragment>
                <PickMembershipModal
                    modalIsOpen={this.state.currentModal === "PickMembershipModal"}
                    closeModal={(e) => this.setState({ currentModal: undefined })}
                />
                <div className="card2" style={{backgroundImage:`url('${this.props.story.thumbnail.url}')`}}>
                    <div className="card2_layer">
                        <h3 className="card2_layer_child">{this.props.story.app.name}</h3>
                        <h6 className="card2_layer_child">{this.props.story.app.description}</h6>
                            <img onClick={e => {
                                this.props.history.push({
                                    pathname: `/story/${this.props.story.id}`,
                                    state: this.props.state                                
                                })
                            }} className="card2_layer_child play_button" src="https://i0.wp.com/thorncliffe.com/wp-content/uploads/2017/05/video-play-icon.png?ssl=1" />
                        <div className="card2_layer_child dropup">
                        <button class="dropbtn button full save_to_library">Save to library</button>
                        <div className="dropup-content">
                        {
                            this.props.user && 
                            <Query query={LIBRARIES_QUERY_SHALLOW}>
                                {({ loading, error, data }) => {
                                    if (loading) return "Loading";
                                    if (error) return error.message;
                                    let libraries = data.libraries ? data.libraries : []
                                    return libraries.map(library => {
                                            return (
                                                <Mutation mutation={SAVE_TO_LIBRARY_MUTATION}>
                                                    {(saveToLibrary, { loading: loading2, error, data }) => {
                                                        return (
                                                            <a onClick={async e => {
                                                                if (loading || loading2) return;
                                                                let res = await saveToLibrary({
                                                                    variables: {
                                                                        story_id: this.props.story.id,
                                                                        library_id: library.id
                                                                    }
                                                                })
                                                                updateShallowLibrariesQueryCache(
                                                                    this.props.client,
                                                                    "connect",
                                                                    library,
                                                                    this.props.story.id
                                                                )
                                                                updateLibrariesQueryCache(
                                                                    this.props.client,
                                                                    "connect",
                                                                    library,
                                                                    this.props.story
                                                                )
                                                                console.log(res)
                                                                toast.success(`Saved to library ${library.name}.`)
                                                            }}>
                                                                {library.name}
                                                            </a>
                                                        )
                                                    }}
                                                </Mutation>
                                            )
                                        })
                                    }}
                                </Query>
                        }
                        {
                            !this.props.user &&  <a onClick={() => this.setState({currentModal:"PickMembershipModal"})}>Welcome Library</a>
                        }
                                </div>
                            </div>
                        </div>
                    </div>
                {/* <Link to={{
                    pathname: `/story/${this.props.story.id}`,
                    state: this.props.state
                }}>
                    <img 
                        src={this.props.story.thumbnail.url} 
                        key={this.props.story.id} 
                        style={this.props.style}     
                    />
                </Link> */}
            </React.Fragment>
        )
    }
}

export default compose(withRouter,withApollo)(_StoryItem);