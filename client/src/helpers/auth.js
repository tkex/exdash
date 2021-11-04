import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

/**
 * File for creating a context
 * Context provides a way to to pass data through the components tree without needing
 * to pass props down manually at every level
 * Meaning context allows components to access the data defined in the context
 * In this case used to create login and logout functionalities to either hold the token or not (remove it)
 * Every component can access the valid token data and check if the user is logged in (or not)
 * Reference: https://reactjs.org/docs/hooks-reference.html#usecontext
 * Reference: https://reactjs.org/docs/context.html#reactcreatecontext
 */

// Set the initial state for user
const initState = {
  user: null,
};

// Check for token expiration
// If there is a token in the local storage
if (localStorage.getItem('token')) {
  // Retrieve the payload of the decoded token
  const tokenDecoded = jwtDecode(localStorage.getItem('token'));

  /* 
    Check if token is expired:
    The token expiration data is represented as NumericDate in the exp field
    Date.now() contains the actual time in milliseconds (Unix timestamp)
    Exp is in seconds therefore: Exp * 1000 to get the expiration time in ms
  */
  if (tokenDecoded.exp * 1000 < Date.now()) {
    // Remove token from local storage
    localStorage.removeItem('token');
  } else {
    // Otherwise set the valid token to user
    initState.user = tokenDecoded;
  }
}

// Create context with a user object, a login function and a logout function
// Login will take data and do something with it, logout will take nothing and do something
const AuthContext = createContext({
  user: null,
  login: (data) => {},
  register: (data) => {},
  logout: () => {},
});

// Reducer function to define initial state changes (given as parameter to useReducer)
// Changing the initial state will determine the new state according to the specific action
function Reducer(state, action) {
  // Depending on the type of action...
  switch (action.type) {
    // When login:
    case 'LOGIN':
      return {
        // Spread existing state to be able to update the state
        ...state,
        // Set user with the transmitted login payload (new state)
        user: action.payload,
      };
    // When register:
    case 'REGISTER':
      return {
        // Spread existing state to be able to update the state
        ...state,
        // Set user with the transmitted register payload (new state)
        user: action.payload,
      };
    // When logout:
    case 'LOGOUT':
      return {
        // Spread existing state to be able to update the state
        ...state,
        // Set user state back to null (clearing token data)
        user: null,
      };
    // If nothing else, return original state
    default:
      return state;
  }
}

// AuthProvider to define the functions for state changes (states will be set in Reducer)
// To enable dispatch functions to get and handle passed data from other components,
// AuthProvider has to take props in as well
function AuthProvider(props) {
  // useReducer for dispatching actions to change the states in the Reducer
  // Reference: https://reactjs.org/docs/hooks-reference.html#usereducer
  const [state, dispatch] = useReducer(Reducer, initState);

  // Login dispatch function (taking in data from the login form field)
  const login = (data) => {
    // Set token after login
    localStorage.setItem('token', data.token);
    // Dispatch to Reducer to set a new state with passed login data
    dispatch({
      type: 'LOGIN',
      payload: data,
    });
  };

  // Register dispatch function (taking in data from the register form field)
  const register = (data) => {
    // Set token after login
    localStorage.setItem('token', data.token);
    // Dispatch to Reducer to set a new state with passed login data
    dispatch({
      type: 'REGISTER',
      payload: data,
    });
  };

  // Logout dispatch function
  const logout = (data) => {
    // Remove token after log out
    localStorage.removeItem('token', data.token); // remove token after logout
    // Dispatch to Reducer to set a new state
    dispatch({ type: 'LOGOUT' });
  };

  /*
    Make all context values available to all (children) components (Providing)
    Passing down the user with its state as the login and logout function
    Spread props in case some props can come back (like for login in this case)
    Reference: https://reactjs.org/docs/context.html#contextprovider
  */
  return <AuthContext.Provider value={{ user: state.user, login, logout, register }} {...props} />;
}

// Export AuthContext and AuthProvider for external usage
export { AuthContext, AuthProvider };
