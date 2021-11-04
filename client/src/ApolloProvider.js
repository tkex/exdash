import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

// Create HttpLink
// Enables to get GraphQL data from the backend (HTTP fetch)
// Reference: https://www.apollographql.com/docs/link/links/http/
const httpLink = createHttpLink({
  // Resolving endpoint
  uri: 'http://localhost:5000',
});

// Set link context for token
// Used to set the local token in the header before a request to the backend (GraphQL server) is made
// For the case to access ressources which requires the token
// setContext allows to set up requests before they are directed to the backend
// Reference: https://www.apollographql.com/docs/link/links/context/
// Reference: https://www.howtographql.com/react-apollo/5-authentication/
const setAuthorizationLink = setContext(() => {
  // Retrieve token from the local storage
  const token = localStorage.getItem('token');
  // Return headers to the context so httpLink is able to read it
  return {
    headers: {
      // If token exists, set authorization header
      // otherwise empty string (tenary operator)
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create new Apollo Client
// set httpLink up with setAuthorization
// cache for storing the results of GraphQL queries in memory cache
// Reference: https://www.howtographql.com/react-apollo/5-authentication/
// Reference: https://www.apollographql.com/docs/react/caching/cache-configuration/
const client = new ApolloClient({
  link: setAuthorizationLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Export configured Apollo Client (used then in index.js)
// Reference: https://www.apollographql.com/docs/react/api/react/hooks/#apolloprovider
// Reference: https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react
export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
