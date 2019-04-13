import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import ApolloClient from "apollo-boost";
import Profile from "./components/profile";
import Stories from "./components/stories";
import Login from "./components/login";
import Loading from "./components/loading";
import Cookies from "js-cookie";
import Library from "./components/library";
import Register from "./components/register";
import SingleApp from "./components/singleApp";
import Home from "./components/home";
import ForgetPassword from "./components/forgetPassword";
import ResetPassword from "./components/resetPassword";
import SingleStory from "./components/singleStory";
import { getQueryParams, loadToolkit } from "./helpers";
import Apps from "./components/admin/apps";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { InMemoryCache } from 'apollo-cache-inmemory';

const URI = "http://localhost:4000";

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
  request: async (operation) => {
    const token = Cookies.get("token");
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  }
});

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: undefined,
            show_message: "",
            show_messages_register: []
        }
    }
    componentDidUpdate(){
        loadToolkit();
    }
    render(){
        return (
            <Router>
            <ApolloProvider client={client}>
                <script src={`${URI}/assets/toolkit/scripts/toolkit.js`}></script>
                    <Query 
                        query={gql`
                                query {
                                    getLoggedInUser{
                                        full_name
                                        email
                                        job {
                                            id
                                            name
                                        }
                                        profile_photo {
                                          url
                                        }   
                                        libraries {
                                            id
                                            name
                                        }
                                      }
                                }
                        `}>
                        {({loading,error,data,refetch}) => {
                            if (error) return <p>{error.message}</p>
                            if (loading) return <Loading style={{margin:140}}/>
                            var user = data.getLoggedInUser
                            return (
                                <div>
                                    <Route path="/" exact component={() => <Home user={user}/>}/>
                                    <Route path="/stories" exact component={() => {
                                        return (
                                            user
                                            ? <Stories user={user} client={client} />
                                            : <Redirect to="/login?success=stories"/>
                                        )

                                    }} />
                                    <Route path="/register" exact component={() => {
                                        return (
                                            user 
                                            ? <Redirect to="/" /> 
                                            : <Register refetchApp={refetch}/>
                                        );
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
                                        return (
                                            <SingleStory 
                                                user={user}
                                               
                                                match={match}
                                            />
                                        );
                                    }} />
                                <Route path="/profile" exact component={() => {
                                    return (
                                        user
                                        ? <Profile refetchApp={refetch} user={user} />
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
                                    return (
                                        user 
                                        ? <SingleApp user={user} match={match}/>
                                        : <Redirect to={`/login?success=app:${match.params.id}`}/>
                                    );
                                }} />

                                <Route path="/admin/apps" exact component={() => {
                                    return (
                                        user && user.role === "ADMIN"
                                        ? <Apps user={user}/>
                                        : <Redirect to={`/login?success=admin:apps`}/>
                                    );
                                }} />

                                </div> 
                            )
                        }}
                    </Query>
                <script src="/assets/toolkit/scripts/jquery.min.js"></script>

                <script src="/assets/toolkit/scripts/toolkit.js"></script>
            </ApolloProvider>
            </Router>
        );
    }
}

export default App;
