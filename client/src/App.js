import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import Profile from "./components/profile";
import Home from "./components/home";
import Header from "./components/header";
import Login from "./components/login";
import Loading from "./components/loading";
import Cookies from "js-cookie";


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
        console.log(this.state.user,111);
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
            let user = data.data.getLoggedInUser
            this.setState({
                user: user
            })
        }
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
                            <Login login={this.login} show_message={this.state.show_message}/>
                        ) 

                        :
                        
                        (    
                            <div>
                                <Header user={this.state.user} />
                                            <Route path="/" exact component={() => {
                                                return <Home user={this.state.user} />
                                            }} />
                                            <Route path="/profile" component={() => {
                                                return (
                                                    <Profile user={this.state.user} client={client} />
                                                );
                                            }} />
                            </div>
                        )
                    )

                }

                <link rel="stylesheet" href="../assets/toolkit/styles/toolkit.css" />
                <script src="../assets/toolkit/scripts/jquery.min.js"></script>
                <script src="../assets/toolkit/scripts/toolkit.js"></script>
            </Router>
        );
    }
}

export default App;
