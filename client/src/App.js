import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import Profile from "./components/profile";
import Home from "./components/home";
import Header from "./components/header";

const client = new ApolloClient({
    uri: "http://localhost:4000/",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanRqN21ocHk2MzBqMGI5MXJucG1zNzlzIiwiaWF0IjoxNTUzMjA3NDY5fQ.YyMqWk8zRE_V02Ic9leg5kuffj8samTQoRdSe4a655w"
    }
})

// client.query({
//     query: gql`
//         query {
//             storyCategories {
//                 id
//             }
//         }
//     `
// }).then(result => console.log(result));

// const Index = () => {
//     return <h2>Home</h2>
// }
// const About = () => {
//     return <h2>About</h2>
// }
// const Users = () => {
//     return <h2>Users</h2>
// }
// const activeStyle = {
//     fontWeight: "bold",
//     color: "red"
// } 

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: {}
        }
    }
    async componentDidMount() {
        const data = await client.query({
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
        })
        console.log(data.data.getLoggedInUser);
        this.setState({
            user: data.data.getLoggedInUser
        })
    }
    render(){
        return (
            <Router>
                <Header user={this.state.user} />
                <Route path="/" exact component={() => {
                    return <Home user={this.state.user} />
                }} />
                <Route path="/profile" component={() => {
                    return (
                        <Profile user={this.state.user} client={client} />
                    );
                }} />

                <link rel="stylesheet" href="../assets/toolkit/styles/toolkit.css" />
                <script src="../assets/toolkit/scripts/jquery.min.js"></script>
                <script src="../assets/toolkit/scripts/toolkit.js"></script>
            </Router>
        );
    }
}

export default App;
