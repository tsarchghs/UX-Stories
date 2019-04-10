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

const URI = "http://localhost:4000";

// Cookies.set("token","");

const client = new ApolloClient({
  uri: URI,
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
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }
    componentDidUpdate(){
        loadToolkit();
    }
    async componentDidMount() {
        // try {
        //     var data = await client.query({
        //             query: gql`
        //                 query {
        //                     getLoggedInUser{
        //                     first_name
        //                     last_name
        //                     email
        //                     job {
        //                         id
        //                         name
        //                     }
        //                     profile_photo {
        //                       url
        //                     }
        //                     libraries {
        //                         id
        //                         name
        //                     }
        //                   }
        //                 }
        //             `
        //         });
        // } catch (e) {
        //     if (e.message === "GraphQL error: Not logged in"){
        //         this.setState({
        //             user: null
        //         })
        //     }
        // }
        // if (data){
        //     let user = data.data.getLoggedInUser;
        //     user.logout = this.logout;
        //     this.setState({
        //         user:user
        //     })
        // }
    }
    async login(e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            var data = await client.query({
                query: gql`
                    query {
                        login(
                            email: "${email}",
                            password: "${password}"
                        ) {
                            token
                        }
                    }
                `
            })
        } catch (e) {
            if (e.message === "GraphQL error: Invalid credentials") {
                this.setState({
                    show_message:"Invalid credentials"
                });
            }
        }
        if (data) {
            Cookies.set("auth_token",data.data.login.token);
            this.componentDidMount();
        }
    }
    async register(e) {
        e.preventDefault();
        this.setState({
            show_messages_register: []
        })
        const a = JSON.parse(JSON.stringify(document.getElementById("r_full_name").value));
        const full_name = a.split(" ");
        console.log(document.getElementById("r_full_name"));
        const r_first_name = full_name[0];
        const r_last_name = full_name[1];
        const r_email = document.getElementById("r_email").value;
        const r_password = document.getElementById("r_password").value;
        const r_job = document.getElementById("r_job").value;
        if (full_name.length !== 2 || !full_name[1]){
            this.setState(prevState => {
                let message = "Full name format must be like for example 'John Doe'"
                let add_error = !prevState.show_messages_register.includes(message);
                if (add_error){
                    prevState.show_messages_register.push(message)
                }
                return prevState
            })
        } else {
            try {
                const results = await client.mutate({
                    mutation: gql`
                        mutation {
                            signUp(
                                first_name:"${r_first_name}"
                                last_name:"${r_last_name}"
                                email:"${r_email}"
                                password:"${r_password}"
                                job:"${r_job}"
                            ) { 
                                token
                            }
                        }
                    `
                })
                client = new ApolloClient({
                    uri: URI,
                    headers: {
                      "Authorization": `Bearer ${results.data.signUp.token}`
                    }
                })
                Cookies.set("auth_token",results.data.signUp.token);
                this.componentDidMount();
            } catch (e){
                let add;
                if (e.message === "GraphQL error: Please check that all of your arguments are not empty!" 
                    && !(r_first_name || r_last_name)){
                    add = "Please check that all of your arguments are not empty!"
                } else if (e.message === "GraphQL error: A unique constraint would be violated on User. Details: Field name = email"){
                    add = "Email is already taken." 
                }
                this.setState(prevState => {
                    let state = prevState
                    let add_error = !state.show_messages_register.includes(add);
                    if (add_error){
                        state.show_messages_register.push(add)
                    }
                    return state
                })
            }
        }
    }
    logout(e) {
        console.log(123);
        e.preventDefault();
        this.setState({
            user: null,
            show_message:""
        })
        Cookies.set("token","");
    }
    async updateProfile() {
        let full_name = document.getElementById("p_full_name").value;
        let job = document.getElementById("p_job").value;
        let email = document.getElementById("p_email").value;
        let password = document.getElementById("p_password").value;
        let base64 = document.getElementById("profile_image").src.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        var profile_image = document.getElementById("profile_image")
        let data = await client.mutate({
            mutation: gql`
                mutation {
                    editProfile(
                        full_name: "${full_name}"
                        job: "${job}"
                        email: "${email}"
                        ${
                            !profile_image.changed ? "" : `
                            profile_photo: {
                                mimetype: "image/png"
                                base64: "${base64}"
                            }
                            `
                        }
                    ) {
                            first_name
                            last_name
                            email
                            job {
                                id
                                name
                            }
                            profile_photo {
                              url
                            }
                    }
                }
            `
        })
        this.setState({
            user: data.data.editProfile
        })
        document.getElementById("closeEditProfile").click();
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
                                        first_name
                                        last_name
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
                            console.log(data);
                            console.log(`Bearer ${Cookies.get("token")}`);
                            console.log(12321);
                            if (error) return <p>{error.message}</p>
                            if (loading) return <Loading style={{margin:140}}/>
                            var user = data.getLoggedInUser
                            return (
                                <div>
                                    <Route path="/" exact component={() => <Home user={user}/>}/>
                                    <Route path="/stories" exact component={() => {
                                        return (
                                            user
                                            ? <Stories user={user} />
                                            : <Redirect to="/login?success=stories"/>
                                        )

                                    }} />
                                    <Route path="/register" exact component={() => {
                                        return (
                                            user 
                                            ? <Redirect to="/" /> 
                                            : <Register 
                                                
                                                register={this.register} 
                                                show_messages_register={this.state.show_messages_register} 
                                            />
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
                                <Route path="/profile" component={() => {
                                    return (
                                        user
                                        ? <Profile updateProfile={this.updateProfile} user={user} />
                                        : <Redirect to="/login?success=profile"/>
                                    );
                                }} />
                                <Route path="/library/:id" component={({match}) => {
                                    return (
                                        user
                                        ? <Library user={user} match={match}/>
                                        : <Redirect to={`/login?success=library:${match.params.id}`}/>
                                    )
                                }} />
                                <Route path="/app/:id" component={({match}) => {
                                    return (
                                        user 
                                        ? <SingleApp user={user} match={match}/>
                                        : <Redirect to={`/login?success=app:${match.params.id}`}/>
                                    );
                                }} />

                                <Route path="/admin/apps/" component={() => {
                                    console.log(this.state);
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
