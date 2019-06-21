import React from "react";
import Header from "./header";
import { Link } from "react-router-dom";

class Price extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div>
                <Header user={this.props.user} />
                <div className="price">
                    <div className="price__content">
                        <div className="login__header mb50">
                            <h2 className="bold">Welcome on board</h2>
                            <p className="gray">We are soo happy to see you here, we have two options to make your experience great in UXstories.</p>
                        </div>
                        <div className="cards">
                            <div className="price-card">
                                <h3 className="pink">Starter</h3>
                                <h1 className="bold">Free</h1>
                                <p>Per lifetime</p>
                                <div className="price-card__options">
                                    <p className="bold"><span></span>Browse all apps/stories</p>
                                    <p className="light-gray bold"><span></span>Create Unlimited libraries</p>
                                    <p className="light-gray bold"><span></span>Version travel</p>
                                </div>
                                <div className="text-center">
                                <Link to="/">
                                    <button className="button">Continue Free</button>
                                </Link>
                                </div>
                            </div>
                            <div className="price-card pink">
                                <h3 className="white">Pro Plan</h3>
                                <h1 className="bold white">$24</h1>
                                <p className="white">Yearly Subscription</p>
                                <div className="price-card__options">
                                    <p className="bold white"><span></span>Browse all apps/stories</p>
                                    <p className="bold white"><span></span>Create Unlimited libraries</p>
                                    <p className="bold white"><span></span>Version travel</p>
                                </div>
                                <div className="text-center">
                                    <button className="button whitest">Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Price;