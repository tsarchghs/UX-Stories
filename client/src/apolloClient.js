import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import Cookies from "js-cookie";
import { URI } from "./configs";
import { toast } from 'react-toastify';
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const request = async (operation) => {
  const token = Cookies.get("token");
  console.log(token,555)
  operation.setContext({
    headers: {
      authorization: `Bearer ${token}`
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const httpLink = ApolloLink.from([
  onError(({ graphQLErrors, networkError,forward,operation }) => {
    console.log(graphQLErrors, networkError)
    if (networkError && networkError.message.indexOf("Failed") !== -1) {
      toast.error("No internet connection!", { toastId: "InternetError" })
      return;
    }
    if (networkError && networkError.statusCode === 401) {
      toast.error("Not logged in!")
      window.location.href = window.location.href;
      return;
    }
    console.log(graphQLErrors)
    forward(operation)
  }),
  requestLink,
  new HttpLink({
    uri: URI,
    credentials: 'same-origin'
  })
])

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: Cookies.get("token")
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default client;