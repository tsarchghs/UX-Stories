import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ApolloClient from "apollo-boost";
import Profile from "./components/profile";
import Home from "./components/home";
import Header from "./components/header";

const client = new ApolloClient({
    uri: "http://localhost:4000/",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanRjMTN4cGI4MmF5MGI1MnRnMWZoNHYxIiwiaWF0IjoxNTUzMTg0Mzc1fQ.qSaNHTdiQlU15rw5GY2frzrlqm_npH8yeGlDpZq--JM"
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
    render(){
        return (
            <Router>
                <Header />
                <Route path="/" exact component={Home} />
                <Route path="/profile" component={() => {
                    return (
                        <Profile client={client} />
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
