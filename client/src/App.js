import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import { getQueryParams, loadToolkit, initializeReactGA } from "./helpers";
import Profile from "./components/profile";
import Stories from "./components/stories";
import Login from "./components/login";
import Loading from "./components/loading";
import Cookies from "js-cookie";
import Library from "./components/library";
import SignUp from "./components/signUp";
import SingleApp from "./components/singleApp";
import Home from "./components/home";
import ForgetPassword from "./components/forgetPassword";
import ResetPassword from "./components/resetPassword";
import SingleStory from "./components/singleStory";
import Dashboard from "./components/admin/dashboard";
import Payment from "./components/payment";
import { Users, UpdateUser } from "./components/admin/users";
import { Apps, UpdateApp} from "./components/admin/apps";
import { AdminStories, UpdateStory } from "./components/admin/stories";
import { StoryCategories, UpdateStoryCategory} from "./components/admin/storyCategories";
import { StoryElements, UpdateStoryElement } from "./components/admin/storyElements";
import { AppCategories, UpdateAppCategory } from "./components/admin/appCategories";
import { Jobs, UpdateJob } from "./components/admin/jobs";
import client from "./apolloClient";
import { GET_LOGGED_IN_USER_QUERY, CREATE_PAGE_VIEW_MUTATION } from "./Queries";
import {StripeProvider,Elements} from 'react-stripe-elements';
import Invoices from "./components/invoices";
import E404 from "./components/E404";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventListener from 'react-event-listener';
import Detector from "./components/OnlineDetector/Detector";
import InitialSelectJobModal from "./components/initialSelectJobModal"
import ReactGA from "react-ga";

toast.configure({
  autoClose: 5000,
  draggable: true,
  //etc you get the idea
});

const sendPageView = () => {
    let userId;
    try {
        let cache = client.readQuery({
            query: GET_LOGGED_IN_USER_QUERY
        })
        if (cache.getLoggedInUser) {
            userId = cache.getLoggedInUser.id;
        }
    } catch (e) {
        console.log(e);
    }
    client.mutate({
        mutation: CREATE_PAGE_VIEW_MUTATION,
        variables: {
            user: userId,
            agent: navigator.userAgent,
            pathname: window.location.pathname
        }
    })
}

class _App extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: undefined,
            show_message: "",
            show_messages_register: []
        }
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.copiedToClipboardToastId = undefined
        this.keysState = {}
    }
    handleKeyDown(e){
        this.keysState[e.key] = true
        if (this.keysState["Control"] && this.keysState["c"]){
            if (!this.copiedToClipboardToastId || !toast.isActive(this.copiedToClipboardToastId)){
                this.copiedToClipboardToastId = toast.success("Copied to clipboard")
            }
        }
    }
    componentDidMount(){
        sendPageView();
        ReactGA.initialize('UA-144461921-1');
        ReactGA.pageview(window.location.pathname);
        this.props.history.listen(() => {
            sendPageView();
            ReactGA.pageview(window.location.pathname + window.location.search);
            ReactGA.event({
                category: "RouteChange",
                action: `MovedTo:${window.location.pathname}`,
                label: `User moved to ${window.location.pathname}`
            })
        })
    }
    handleKeyUp(e){
        this.keysState[e.key] = false
    }
    render(){
        return (
            <React.Fragment>
                <StripeProvider apiKey={false ? "pk_live_VzebAEDh33V8db6oZe4beNA6" : "pk_test_N1sdoxQTHRHokGxvtutLWw0x00HDZ2RDsi"}>
                    <ApolloProvider client={client}>
                        {/* <script src={`${URI}/assets/toolkit/scripts/toolkit.js`}></script> */}
                            <Query 
                                query={GET_LOGGED_IN_USER_QUERY}>
                                {({loading,error,data,refetch}) => {
                                    if (error) return error.message
                                    if (loading || !Object.keys(data).length) return <Loading style={{margin:140}}/>
                                    var user = data.getLoggedInUser
                                    if (user && !user.logout){
                                        user.logout = async () => {
                                            Cookies.set("token","");
                                            this.props.history.push("/")
                                            await client.resetStore()
                                            refetch()
                                        }
                                    }
                                    return (
                                        <div>
                                            <InitialSelectJobModal
                                                modalIsOpen={user && !user.job}
                                                closeModal={() => null}
                                                user={user}
                                            />
                                            <Switch>
                                                <Route path="/" exact component={() => {
                                                    return <Home refetchApp={refetch} user={user}/>
                                                }}/>
                                                <Route path="/stories" exact component={() => {
                                                    return <Stories user={user} client={client} />

                                                }} />
                                                <Route path="/register" exact component={() => {
                                                    return <SignUp refetchApp={async callback => {
                                                            await refetch()
                                                            callback()
                                                        }} />
                                                    }}     
                                                />
                                                <Route path="/payment" exact component={() => {
                                                    return !user ? <Redirect to="/register" /> : <Elements><Payment user={user} /></Elements>
                                                }} />
                                                <Route path="/invoices" exact component={() => {
                                                    return !user ? <Redirect to="/login?success=invoices" /> : <Elements><Invoices user={user} /></Elements>
                                                }} />
                                                
                                                <Route path="/login" exact component={()  => {
                                                    let params = getQueryParams(window.location.href);
                                                    if (user && params["success"]){
                                                        return <Redirect to={`${params["success"].replace(":","/")}`}/>
                                                    } else {
                                                        return user 
                                                            ? <Redirect to="/"/>
                                                            : <Login refetchApp={refetch}/>
                                                    }
                                                }} />
                                                <Route path="/forget_password" exact component={() => {
                                                        return (
                                                            user
                                                            ? <Redirect to="/"/>
                                                            : <ForgetPassword />
                                                        )
                                                    }}/>
                                                <Route path="/reset/:token" exact component={(match) => {
                                                    return (
                                                        <ResetPassword 
                                                            user={user}
                                                            match={match}
                                                        />
                                                    )
                                                }} />
                                                <Route path="/story/:id" exact component={match => {
                                                    return <SingleStory
                                                        user={user}
                                                        match={match}
                                                    />
                                                }} />
                                            <Route path="/profile" exact component={() => {
                                                return (
                                                    user
                                                    ? <Profile refetchApp={to => {
                                                        refetch()
                                                        if (to){
                                                            this.props.history.push(to)
                                                        }
                                                    }} user={user} />
                                                    : <Redirect to="/login?success=profile"/>
                                                );
                                            }} />
                                            <Route path="/library/:id" exact component={({match}) => {
                                                return (
                                                    user
                                                    ? <Library user={user} match={match}/>
                                                    : <Redirect to={`/login?success=library:${match.params.id}`}/>
                                                )
                                            }} />
                                            <Route path="/app/:id" exact component={({match}) => {
                                                    return <SingleApp user={user} match={match} />
                                            }} />

                                            <Route path="/admin" component={() => {
                                                if (!user || user.role !== "ADMIN"){
                                                    window.location.href = "/"
                                                }
                                                return (
                                                    <div>
                                                        <Route path="/admin/apps" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <Apps user={user}/>
                                                                : <Redirect to={`/login?success=admin:apps`}/>
                                                            );  
                                                        }} />

                                                        <Route path="/admin/stories" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <AdminStories user={user}/>
                                                                : <Redirect to={`/login?success=admin:stories`}/>
                                                            );
                                                        }} />
                                                        
                                                        <Route path="/admin/story_categories" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <StoryCategories user={user}/>
                                                                : <Redirect to={`/login?success=admin:story_categories`}/>
                                                            );
                                                        }} />
                                                        
                                                        <Route path="/admin/story_elements" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <StoryElements user={user}/>
                                                                : <Redirect to={`/login?success=admin:story_elements`}/>
                                                            );
                                                        }} />
                                                        
                                                        <Route path="/admin/users" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <Users user={user}/>
                                                                : <Redirect to={`/login?success=admin:users`}/>
                                                            );
                                                        }} />

                                                        <Route path="/admin/app_categories" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <AppCategories user={user} />
                                                                    : <Redirect to={`/login?success=admin:app_categories`} />
                                                            );
                                                        }} />
                                                        <Route path="/admin/jobs" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <Jobs user={user}/>
                                                                : <Redirect to={`/login?success=admin:jobs`}/>
                                                            );
                                                        }} />
                                                        
                                                        <Route path="/admin/dashboard" exact component={() => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <Dashboard user={user}/>
                                                                : <Redirect to={`/login?success=admin:dashboard`}/>
                                                            );
                                                        }} />
                                                        <Route path="/admin/app_category/:id" component={({match}) =>{
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                ? <UpdateAppCategory match={match} user={user}/>
                                                                : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }}/>
                                                        <Route path="/admin/story_category/:id" component={({ match }) => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <UpdateStoryCategory match={match} user={user} />
                                                                    : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }} />
                                                        <Route path="/admin/story_element/:id" component={({ match }) => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <UpdateStoryElement match={match} user={user} />
                                                                    : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }} />
                                                        <Route path="/admin/user/:id" component={({ match }) => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <UpdateUser match={match} user={user} />
                                                                    : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }} />
                                                        <Route path="/admin/story/:id" component={({ match }) => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <UpdateStory match={match} user={user} />
                                                                    : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }} />
                                                        <Route path="/admin/app/:id" component={({ match }) => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <UpdateApp match={match} user={user} />
                                                                    : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }} />
                                                        <Route path="/admin/job/:id" component={({ match }) => {
                                                            return (
                                                                user && user.role === "ADMIN"
                                                                    ? <UpdateJob match={match} user={user} />
                                                                    : <Redirect to={`/login?success=typename_friendly_url:id`} />
                                                            )
                                                        }} />
                                                    </div>
                                                )
                                            }}/>
                                            <Route component={E404}/>
                                        </Switch>
                                        </div> 
                                    )
                                }}
                            </Query>
                    </ApolloProvider>
                </StripeProvider>
                <Detector>
                    { ({online}) => {
                        if (!online){
                            toast.error("No internet connection!", { toastId: "InternetError" })
                            this.wasDisconnected = true;
                        }
                        if (online && this.wasDisconnected){
                            toast.success("You are back online!", { toastId: "RECONNECTED"} )
                            this.wasDisconnected = false;
                        }
                        return (
                            <EventListener
                                target="window"
                                onKeyDown={this.handleKeyDown}
                                onKeyUp={this.handleKeyUp}
                            />
                        )
                    }}
            </Detector>
            </React.Fragment>
        );
    }
}

export default withRouter(_App);
