import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import { API_URI, DISABLE_WS_SUBSCRIPTIONS, WS_URI } from "./configs";

const LEGACY_SUBSCRIPTION_NAMES = new Set([
  "GetMemoryUsage",
  "GetMemwatchLeak",
  "GetMemwatchStats",
  "GetSystemCpuUsage"
]);

const authLink = new ApolloLink((operation, forward) => {
  const token = Cookies.get("token");

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }));

  return forward(operation);
});

const errorLink = onError(({ networkError }) => {
  if (networkError?.message?.includes("Failed")) {
    toast.error("No internet connection!", { toastId: "InternetError" });
    return;
  }

  if (networkError?.statusCode === 401) {
    toast.error("Not logged in!");
    window.location.href = window.location.href;
  }
});

const httpLink = ApolloLink.from([
  errorLink,
  authLink,
  new HttpLink({
    credentials: "same-origin",
    uri: API_URI
  })
]);

let link = httpLink;

if (!DISABLE_WS_SUBSCRIPTIONS && typeof window !== "undefined") {
  const subscriptionClient = new SubscriptionClient(WS_URI, {
    connectionParams: () => ({
      authToken: Cookies.get("token")
    }),
    reconnect: true
  });

  const wsLink = new WebSocketLink(subscriptionClient);

  link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription" &&
        LEGACY_SUBSCRIPTION_NAMES.has(definition.name?.value)
      );
    },
    wsLink,
    httpLink
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

export default client;
