import ReactDOM from 'react-dom';
import ApolloProvider from './ApolloProvider';

// Wrap entire React app with ApolloProvider
// so that each component has access to the context ApolloProvider provides
// Like the access to GraphQL data from queries (made over Apollo Client)
// Reference: https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react
ReactDOM.render(ApolloProvider, document.getElementById('root'));
