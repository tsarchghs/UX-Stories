import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';
import Cookies from "js-cookie";
import { URI } from "./configs";
import { toast } from 'react-toastify';


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
  },
  onError: ({operation,networkError,graphQLErrors,forward}) => {
    if (networkError && networkError.message.indexOf("Failed") !== -1){
      toast.error("No internet connection!",{ toastId: "InternetError" })
      return;
    }
    if (networkError && networkError.statusCode === 401) {
      toast.error("Not logged in!")
      window.location.href = window.location.href;
      return;
    }
    console.log(graphQLErrors)
    forward(operation)
  }
});

export default client;