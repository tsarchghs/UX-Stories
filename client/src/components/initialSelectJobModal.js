import React from "react";
import Modal from "react-responsive-modal";
import { withApollo, Query, Mutation } from "react-apollo";
import { EDIT_PROFILE_MUTATION, JOBS_QUERY, GET_LOGGED_IN_USER_QUERY } from "../Queries";
import Loading from "./loading";
import { toast } from "react-toastify";

const customStyles = {
    modal: {
        bottom: 'auto',
        width: "368px",
        borderRadius: "6px",
        outline: "none",
        transform: "translate(2%, 154%)  "
    },
    overlay: {
        backgroundColor: "rgba(10, 10, 10, 0.75)"
    }
};

class _InitialSelectJobModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: undefined
        }
        
    }
    render() {
        return (
            <Modal
                open={this.props.modalIsOpen}
                styles={customStyles}
                type="fadeIn"
                animationDuration={250}
            >
                <React.Fragment>
                    <Query query={JOBS_QUERY}>
                        {({ loading, error, data }) => {
                            if (error) return error.message;
                            if (loading) return <Loading/>
                            return (
                                <Mutation mutation={EDIT_PROFILE_MUTATION}>
                                    {(editProfile, { loading:loading2, error:error2, data:data2 }) => {
                                        if (error2){
                                            toast.error("Something unexpected happened!")
                                        }
                                        let _default = !this.state.job && data.jobs[0]
                                        return (
                                            <form onSubmit={e => {
                                                e.preventDefault();
                                                if (loading2) return;

                                                let job;
                                                if (_default) job = _default
                                                else job = this.state.job
                                                
                                                editProfile({
                                                    variables: {job: job.id},
                                                    optimisticResponse: {
                                                        editProfile: {
                                                            ...this.props.user,
                                                            job: {
                                                                __typename: "Job",
                                                                ...job
                                                            }
                                                        },
                                                        __typename: "Mutation"
                                                    }
                                                })
                                            }}>
                                                Job:
                                                    {
                                                        data.jobs.map(job => {
                                                            let checked;
                                                            if (_default) checked = _default.id === job.id
                                                            else checked = this.state.job.id === job.id
                                                            return (
                                                                <label>
                                                                    <input
                                                                        style={{display:"inline"}}
                                                                        type="radio"
                                                                        checked={checked}
                                                                        onChange={e => this.setState({ job: {
                                                                                id: e.target.id,
                                                                                name: e.target.value
                                                                            }}
                                                                        )}
                                                                        key={job.id}
                                                                        id={job.id}
                                                                        value={job.name}
                                                                    />
                                                                    {job.name}
                                                                </label>
                                                            )
                                                        })
                                                    }
                                                <button type="submit">Continue</button>
                                            </form>
                                        )
                                    }}
                                </Mutation>
                            )
                        }}
                    </Query>
                </React.Fragment>
            </Modal>
        )
    }
}

export default withApollo(_InitialSelectJobModal);