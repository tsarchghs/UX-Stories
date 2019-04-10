import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
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
import { getQueryParams } from "./helpers";

//Cookies.set("auth_token","");
var client = new ApolloClient({
    uri: "http://uxstories.herokuapp.com/",
    headers: {
      "Authorization": `Bearer ${Cookies.get("auth_token")}`
    }
})

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
    async componentDidMount() {
        console.log(this.state.user);
        try {
            var data = await client.query({
                    query: gql`
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
                          }
                        }
                    `
                });
        } catch (e) {
            if (e.message === "GraphQL error: Not logged in"){
                this.setState({
                    user: null
                })
            }
        }
        if (data){
            let user = data.data.getLoggedInUser;
            user.logout = this.logout;
            this.setState({
                user:user
            })
        }
        console.log(this.state.user,data);

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
            client = new ApolloClient({
                uri: "http://localhost:4000/",
                headers: {
                  "Authorization": `Bearer ${data.data.login.token}`
                }
            })
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
                    uri: "http://localhost:4000/",
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
        var client = new ApolloClient({
            uri: "http://localhost:4000/"
        })

        Cookies.set("auth_token","");
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
            <script src="http://localhost:3000/assets/toolkit/scripts/toolkit.js"></script>
                {

                    this.state.user === undefined ?                       
                    (
                            <Loading style={{margin:140}}/>
                    )

                    :
                    (
                            <div>
                                <Route path="/" exact component={() => <Home user={this.state.user} client={client}/>}/>
                                <Route path="/stories" exact component={() => {
                                    return (
                                        this.state.user
                                        ? <Stories user={this.state.user} client={client} />
                                        : <Redirect to="/login?success=stories"/>
                                    )

                                }} />
                                <Route path="/register" exact component={() => {
                                    return (
                                        this.state.user 
                                        ? <Redirect to="/" /> 
                                        : <Register 
                                            client={client} 
                                            register={this.register} 
                                            show_messages_register={this.state.show_messages_register} 
                                        />
                                    );
                                }} />
                                <Route path="/login" exact component={()  => {
                                    let params = getQueryParams(window.location.href);
                                    if (this.state.user && params["success"]){
                                        return <Redirect to={`${params["success"].replace(":","/")}`}/>
                                    } else {
                                        return this.state.user 
                                            ? <Redirect to="/"/>
                                            : <Login login={this.login} show_message={this.state.show_message} />
                                    }
                                }} />
                                <Route path="/forget_password" exact component={() => {
                                        return (
                                            this.state.user
                                            ? <Redirect to="/"/>
                                            : <ForgetPassword client={client} />
                                        )
                                    }}/>
                                <Route path="/reset/:token" exact component={(match) => {
                                    return (
                                        <ResetPassword 
                                            user={this.state.user} 
                                            client={client}
                                            match={match}
                                        />
                                    )
                                }} />
                                <Route path="/story/:id" exact component={match => {
                                    return (
                                        <SingleStory 
                                            user={this.state.user}
                                            client={client}
                                            match={match}
                                        />
                                    );
                                }} />
                            <Route path="/profile" component={() => {
                                return (
                                    this.state.user
                                    ? <Profile updateProfile={this.updateProfile} user={this.state.user} client={client} />
                                    : <Redirect to="/login?success=profile"/>
                                );
                            }} />
                            <Route path="/library/:id" component={({match}) => {
                                return (
                                    this.state.user
                                    ? <Library user={this.state.user} client={client} match={match}/>
                                    : <Redirect to={`/login?success=library:${match.params.id}`}/>
                                )
                            }} />
                            <Route path="/app/:id" component={({match}) => {
                                return (
                                    this.state.user 
                                    ? <SingleApp user={this.state.user} client={client} match={match}/>
                                    : <Redirect to={`/login?success=app:${match.params.id}`}/>
                                );
                            }} />
                            </div> 
                    )
                }
                                            <script src="/assets/toolkit/scripts/jquery.min.js"></script>

                                            <script src="/assets/toolkit/scripts/toolkit.js"></script>


            </Router>
        );
    }
}

export default App;
