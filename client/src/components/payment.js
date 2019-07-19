import React from "react";
import Header from "./header";
import { Link } from "react-router-dom";
import { CardElement, injectStripe } from 'react-stripe-elements';
import { Mutation, withApollo } from "react-apollo";
import { CANCEL_SUBSCRIPTION_MUTATION, RENEW_SUBSCRIPTION_MUTATION, PAYMENT_MUTATION, GET_LOGGED_IN_USER_QUERY } from "../Queries";
import { compose } from "recompose";

class _Payment extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            card_error: "",
            loading: false
        }
        this.createStripeToken = this.createStripeToken.bind(this);
    }
    async createStripeToken() {
        let stripe_res = await this.props.stripe.createToken({ name: "Yearly Pro Plan" });
        if (stripe_res.error) {
            this.setState({
                card_error: stripe_res.error.message,
                loading: false
            })
            return false;
        } else {
            this.setState({
                card_error: ""
            })
            return stripe_res.token.id;
        }
    }
    toggleDropDown(value) {
        this.setState(prevState => {
            let last_value = prevState["currentDropdown"];
            prevState["currentDropdown"] = last_value === value ? undefined : value
            console.log(last_value, 55, value)
            return prevState;
        })
    }
    render(){
        let type = {};
        let subscription = this.props.user.subscription;
        if (!subscription) type = { show: "complete", mutation: PAYMENT_MUTATION }
        else if (subscription.status === "canceled" || subscription.cancel_at_period_end) type = { show: "renew", mutation: RENEW_SUBSCRIPTION_MUTATION }
        else if (subscription.status === "active") type = { show: "cancel", mutation: CANCEL_SUBSCRIPTION_MUTATION }
        return (
            <div>
                <Header 
                    user={this.props.user}
                    opened={this.state.currentDropdown === "profileDropdown"}
                    toggleOpened={() => this.toggleDropDown("profileDropdown")}
                    closeDropdown={() => this.setState({ currentDropdown: undefined })}
                />
                <div className="price">
                    <div className="price__content">
                        <div className="login__header mb50">
                            <h2 className="bold">Welcome on board</h2>
                            <p className="gray">We are soo happy to see you here, we have two options to make your experience great in UXstories.</p>
                        </div>
                        <div className="cards">
                            <div className="price-card pink" style={{
                                width: 319
                            }}>
                                <h3 className="white">Pro Plan {subscription && subscription.status !== "NULL" ? "(Current Plan)" : null}</h3>
                                <h1 className="bold white">$49</h1>
                                <p className="white">Yearly Subscription</p>
                                <div className="price-card__options">
                                    <p className="bold white"><span></span>Browse all apps/stories</p>
                                    <p className="bold white"><span></span>Create Unlimited libraries</p>
                                    <p className="bold white"><span></span>Version travel</p>
                                </div>
                                <div>
                                <Mutation 
                                    mutation={type.mutation}
                                >
                                {(mutationFunc) => {
                                    return (
                                        <form onSubmit={async e => {
                                            e.preventDefault()
                                            let cancel = subscription && subscription.status === "active"
                                            let res;
                                            this.setState({loading: true})
                                            if (!cancel){
                                                let stripe_token = await this.createStripeToken();
                                                res = await mutationFunc({
                                                    variables: {
                                                        stripe_token
                                                    }
                                                })
                                                let cache = this.props.client.readQuery({
                                                    query: GET_LOGGED_IN_USER_QUERY
                                                })
                                                let deep_clone = JSON.parse(JSON.stringify(cache))
                                                deep_clone.getLoggedInUser.subscription = res.data.payment;
                                                this.props.client.writeQuery({
                                                    query: GET_LOGGED_IN_USER_QUERY,
                                                    data: deep_clone
                                                })
                                            } else {
                                                res = await mutationFunc();
                                            }
                                            this.setState({loading: false})
                                        }}>
                                            <div style={{
                                                display: subscription && subscription.status !== "NULL" ? "none" : "block"
                                            }}>
                                                <CardElement />
                                                <p style={{
                                                    marginBottom: 19
                                                }}>{this.state.card_error}</p>
                                            </div>

                                            <div className="text-center">
                                                <button className="button whitest">
                                                    {this.state.loading ? "Processing" : type.show}
                                                </button>
                                            </div>
                                        </form>
                                    )
                                }}
                                </Mutation>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(withApollo,injectStripe)(_Payment);