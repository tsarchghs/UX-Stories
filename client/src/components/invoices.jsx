import React from "react";
import Header from "./header";
import { Query, Mutation, withApollo } from "react-apollo";
import { GET_INVOICES_QUERY, GET_CUSTOMER_INFO, UPDATE_CARD_MUTATION } from "../Queries";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    injectStripe
} from "react-stripe-elements";
import { compose } from "recompose";
import { toast } from 'react-toastify';

class _Invoices extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentDropdown: undefined,
            card_error: ""
        }
        this.createStripeToken = this.createStripeToken.bind(this)
        this.toggleDropdown = this.toggleDropDown.bind(this)
    }
    toggleDropDown(value) {
        this.setState(prevState => {
            let last_value = prevState["currentDropdown"];
            prevState["currentDropdown"] = last_value === value ? undefined : value
            console.log(last_value, 55, value)
            return prevState;
        })
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
    render(){
        let backgroundImage = this.props.user.profile_photo ? this.props.user.profile_photo.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOo9ftjYQCU8HW1YByx0oAQdegRxO51mQN0tKKenGRnDZb-_D6"
        return (
            <div>
                <Header 
                    user={this.props.user} 
                    opened={this.state.currentDropdown === "profileDropdown"}
                    toggleOpened={() => this.toggleDropDown("profileDropdown")}
                    closeDropdown={() => this.setState({ currentDropdown: undefined })}
                />
                <div className="subscription">
                    <div className="subscription__container">
                        <div className="subscription__content">
                            <div className="subscription__user">
                                <div className="subscription__user--img" style={{ backgroundImage: `url(${backgroundImage})` }} />
                                <h2 className="bold">{this.props.user.full_name}</h2>
                            </div>
                            <div className="subscription__subscription">
                                <h3 className="bold">My Subscriptions</h3>
                                <hr />
                                <h5 className="bold">Credit Card</h5>
                                <Query query={GET_CUSTOMER_INFO}>
                                    {({loading,error,data}) => {
                                        if (loading) return loading;
                                        if (error) return error.message;
                                        let source = data.getLoggedInUser && data.getLoggedInUser.customer.source
                                        return (
                                            <React.Fragment>
                                                { 
                                                    source ? 
                                                    <React.Fragment>                                            
                                                        <div className="dashboard-layout__header flex-column">
                                                            <div className="creditcard">
                                                            {
                                                                this.state.updateCard && 
                                                                    <Mutation
                                                                        mutation={UPDATE_CARD_MUTATION}
                                                                    >
                                                                        {(updateCard,{loading,error,data}) => {
                                                                            if (error) return error.message;
                                                                            if (this.state.loading) loading = true;
                                                                            return (
                                                                                <form onSubmit={async e => {
                                                                                    if (loading || this.state.loading) return;
                                                                                    e.preventDefault()
                                                                                    this.setState({loading:true})
                                                                                    let token = await this.createStripeToken()
                                                                                    if (!token) return;
                                                                                    let res = await updateCard({
                                                                                        variables: {
                                                                                            stripe_token: token
                                                                                        }
                                                                                    })
                                                                                    let cache = this.props.client.readQuery({
                                                                                        query: GET_CUSTOMER_INFO
                                                                                    })
                                                                                    cache.getLoggedInUser.customer.source = res.data.updateCard;
                                                                                    this.props.client.writeQuery({
                                                                                        query: GET_CUSTOMER_INFO,
                                                                                        data: JSON.parse(JSON.stringify(cache))
                                                                                    })
                                                                                    toast.success("Updated card!")
                                                                                    this.setState({updateCard:false,loading: false})
                                                                                    console.log(res)
                                                                                }}>
                                                                                    <label>
                                                                                        Card number
                                                                                        <CardNumberElement/>
                                                                                    </label>
                                                                                    <label>
                                                                                        Expiration date
                                                                                        <CardExpiryElement/>
                                                                                    </label>
                                                                                    <label>
                                                                                        CVC
                                                                                        <CardCVCElement/>
                                                                                        {
                                                                                            this.state.card_error
                                                                                        }
                                                                                    </label>
                                                                                    {
                                                                                        loading ? "Loading" :
                                                                                        <React.Fragment>
                                                                                            <button style={{ backgroundColor: "#503a3a", width: "100%" }} className="button">Edit</button>
                                                                                            <button 
                                                                                                onClick={e => {
                                                                                                    this.setState({updateCard: false})
                                                                                                }} 
                                                                                                style={{ backgroundColor: "#503a3a", width: "100%", marginTop: 10 }} 
                                                                                                className="button"
                                                                                            >
                                                                                                Close
                                                                                            </button>

                                                                                        </React.Fragment>
                                                                                    }
                                                                                </form>
                                                                            )
                                                                        }}
                                                                    </Mutation>
                                                            }
                                                            {
                                                                !this.state.updateCard && 
                                                                    <React.Fragment>
                                                                        <div>
                                                                            <h3 className="creditcard__number">**** **** **** {source.last4}</h3>
                                                                            <p>{source.brand}</p>
                                                                        </div>
                                                                        <div className="creditcard__footer">
                                                                            <p>{source.exp_month < 9 ? `0` + source.exp_month : source.exp_month}/{source.exp_year}</p>
                                                                            <a onClick={e => {
                                                                                e.preventDefault()
                                                                                this.setState({updateCard: true})
                                                                            }} style={{ backgroundColor:"#503a3a" }} className="button">Edit</a>
                                                                        </div>
                                                                    </React.Fragment>
                                                            }
                                                            </div>
                                                        </div> 
                                                    </React.Fragment>
                                                    :
                                                        <p className="gray bold sbsm">Currently, you don’t have a credit card on file. You can <a href="#" className="pink">add a credit card</a> which allows you to easily purchase jobs.</p>
                                                }
                                            </React.Fragment>
                                        )
                                    }}
                                </Query>
                                <div className="table-content">
                                    <h5 className="bold">Invoices History</h5>
                                    <Query query={GET_INVOICES_QUERY}>
                                        {({loading,error,data}) => {
                                            if (loading) return "Loading";
                                            if (error) return error.message
                                            return (
                                                <table className="unstriped payments-table">
                                                    <thead>
                                                        <tr>
                                                            <td>Start Date</td>
                                                            <td>End date</td>
                                                            <td>Type</td>
                                                            <td>Price</td>
                                                            <td style={{ width: '20%' }}>Billing frequency</td>
                                                            <td>Invoice</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        data.getLoggedInUser.invoices.map(invoice => (
                                                            <tr>
                                                                <td>2 January</td>
                                                                <td>2 January</td>
                                                                <td><p className="pink">PRO</p></td>
                                                                <td className="td-bold">${invoice.total / 100}</td>
                                                                <td className="td-green">Yearly</td>
                                                                <td className="td-blue"><a href={invoice.hosted_invoice_url} target="_blank" className="button">View</a></td>
                                                            </tr>
                                                        ))
                                                    }
                                                    {
                                                        data.getLoggedInUser.invoices.length ? null
                                                        : <center><p className="gray bold sbsm">No invoices to show</p></center>
                                                    }
                                                    </tbody>
                                                </table>
                                            )
                                        }}
                                    </Query>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(withApollo,injectStripe)(_Invoices);