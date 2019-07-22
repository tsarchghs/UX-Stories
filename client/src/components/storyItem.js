import React from "react";
import { Mutation, Query, withApollo } from "react-apollo";
import { LIBRARIES_QUERY_SHALLOW, SAVE_TO_LIBRARY_MUTATION } from "../Queries";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { updateShallowLibrariesQueryCache, updateLibrariesQueryCache } from "../cacheModification";

class _StoryItem extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <React.Fragment>
            {
                this.props.user && 
                <Query query={LIBRARIES_QUERY_SHALLOW}>
                    {({loading,error,data}) => {
                        return null;
                        if (loading) return "Loading";
                        if (error) return null;
                        return data.libraries.map(library => {
                            return (
                                <Mutation mutation={SAVE_TO_LIBRARY_MUTATION}>
                                    {(saveToLibrary,{loading: loading2,error,data}) => {
                                        return (
                                            <p onClick={async e => {
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
                                                toast.success("Saved to library.")
                                            }}>
                                                {library.name}
                                            </p>
                                        )
                                    }}
                                </Mutation>
                            )
                        })
                    }}

                </Query>
            }
                <Link to={{
                    pathname: `/story/${this.props.story.id}`,
                    state: this.props.state
                }}>
                    <img 
                        src={this.props.story.thumbnail.url} 
                        key={this.props.story.id} 
                        style={this.props.style}     
                    />
                </Link>
            </React.Fragment>
        )
    }
}

export default withApollo(_StoryItem);