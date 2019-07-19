import React from "react";
import Header from "./header";
import { Query } from "react-apollo";
import { GET_INVOICES_QUERY, GET_CUSTOMER_INFO } from "../Queries";

class Invoices extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentDropdown: undefined
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
                                        return (
                                            <React.Fragment>
                                                { 
                                                    data.customer ? null :
                                                    <p className="gray bold sbsm">Currently, you don’t have a credit card on file. You can <a href="#" className="pink">add a credit card</a> which allows you to easily purchase jobs.</p>
                                                }
                                            </React.Fragment>
                                        )
                                    }}
                                </Query>
                                <a href="#" className="button">Update Card</a>
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

export default Invoices;