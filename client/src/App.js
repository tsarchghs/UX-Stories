import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import Profile from "./components/profile";
import Home from "./components/home";
import Login from "./components/login";
import Loading from "./components/loading";
import Cookies from "js-cookie";
import Library from "./components/library";
import Register from "./components/register";
import SingleApp from "./components/singleApp";

//Cookies.set("auth_token","");
var client = new ApolloClient({
    uri: "http://localhost:4000/",
    headers: {
      "Authorization": `Bearer ${Cookies.get("auth_token")}`
    }
})

// const client = new ApolloClient({
//     uri: "http://localhost:4000/",
//     headers: {
//       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanRqN21ocHk2MzBqMGI5MXJucG1zNzlzIiwiaWF0IjoxNTUzMjA3NDY5fQ.YyMqWk8zRE_V02Ic9leg5kuffj8samTQoRdSe4a655w"
//     }
// })

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: undefined,
            show_message: ""
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
    }
    async componentDidMount() {
        try {
            var data = await client.query({
                    query: gql`
                        query {
                            getLoggedInUser{
                            first_name
                            last_name
                            email
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
        console.log(data);
        } catch (e) {
            if (e.message === "GraphQL error: Invalid credentials") {
                this.setState({
                    show_message:"Invalid credentials"
                });
            }
            console.log(e);
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
        const r_first_name = document.getElementById("r_first_name").value;
        const r_last_name = document.getElementById("r_last_name").value;
        const r_email = document.getElementById("r_email").value;
        const r_password = document.getElementById("r_password").value;
        const results = await client.mutate({
            mutation: gql`
                mutation {
                    signUp(
                        first_name:"${r_first_name}"
                        last_name:"${r_last_name}"
                        email:"${r_email}"
                        password:"${r_password}"
                    ) { 
                        token
                    }
                }
            `
        })
        console.log(results.data.signUp.token);
        client = new ApolloClient({
            uri: "http://localhost:4000/",
            headers: {
              "Authorization": `Bearer ${results.data.signUp.token}`
            }
        })
        Cookies.set("auth_token",results.data.signUp.token);
        this.componentDidMount();
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
    render(){
        return (
            <Router>
                {

                    this.state.user === undefined ?                       
                    (
                            <Loading style={{margin:280}}/>
                    )

                    :
                    (
                        this.state.user === null ?
                        (
                            <div>
                                 <Route path="/" exact component={() => <Redirect to="/login"/> } />
                                <Route path="/register" exact component={() => {
                                    return (
                                        <Register register={this.register} show_message_register={""} />
                                    );
                                }} />
                                <Route path="/login" exact component={()  => {
                                    return (
                                        <Login login={this.login} show_message={this.state.show_message} />
                                    );
                                }} />
                            </div>
                        ) 
                        :
                        (    
                            <div>
                                <Route path="/register" exact component={() => {
                                    return (
                                        <Redirect to="/" />
                                    )
                                }} />
                                <Route path="/login" exact component={() => {
                                    return (
                                        <Redirect to="/" />
                                    )
                                }} />
                                <Route path="/" exact component={() => {
                                    return (
                                        <Home user={this.state.user} client={client} />
                                    );
                                }} />
                                <Route path="/profile" component={() => {
                                    return (
                                        <Profile user={this.state.user} client={client} />
                                    );
                                }} />
                                <Route path="/library/:id" component={({match}) => <Library user={this.state.user} client={client} match={match}/> } />
                                <Route path="/app/:id" component={({match}) => <SingleApp user={this.state.user} client={client} match={match}/> } />
                            </div>
                        )
                    )

                }
            </Router>
        );
    }
}

export default App;
