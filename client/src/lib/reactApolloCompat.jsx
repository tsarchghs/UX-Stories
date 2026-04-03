import React from "react";
import "subscriptions-transport-ws";
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription
} from "@apollo/client/react";
import { ApolloProvider as ModernApolloProvider } from "@apollo/client/react";
import gql from "graphql-tag";

export const ApolloProvider = ModernApolloProvider;

export function Query({ children, query, variables, ...options }) {
  const result = useQuery(query, { variables, ...options });
  return children(result);
}

export function Mutation({ children, mutation, ...options }) {
  const [mutate, result] = useMutation(mutation, options);
  return children(mutate, result);
}

export function Subscription({ children, subscription, variables, ...options }) {
  const result = useSubscription(subscription, { variables, ...options });
  return children(result);
}

export function withApollo(Component) {
  const WrappedComponent = (props) => {
    const client = useApolloClient();
    return <Component {...props} client={client} />;
  };

  WrappedComponent.displayName = `withApollo(${Component.displayName || Component.name || "Component"})`;
  return WrappedComponent;
}

export { gql, useApolloClient };
