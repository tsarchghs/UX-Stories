import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';
import Cookies from "js-cookie";
import { URI } from "./configs";

const client = new ApolloClient({
  uri: URI,
  connectToDevTools: true,
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

export default client;