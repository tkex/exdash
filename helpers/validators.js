/**
 * This file contains all input validators for the backend and only for Registering and Login
 * Used primary in the users resolver (resolvers/users.js)
 */

/* 
  RegisterValidation function
  Arrow function according to the ES6 standard
  Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Pfeilfunktionen
*/
module.exports.RegisterValidation = (username, email, password, confirmPassword) => {
  // Inititate empty errors variable (const is not immutable but rather can't be reassigned)
  const errors = {};

  // Check if username field is empty
  if (username.trim() === '') {
    errors.username = 'User field is empty';
  }

  // Check if email field is empty
  if (email.trim() === '') {
    errors.email = 'Email field is empty';
  }

  // Check if password is empty and if password field is the same as the confirmPassword field
  if (password === '') {
    errors.password = 'Password field is empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Your passwords do not match with each other';
  }

  /* 
    Return objects
    If no error happened (less than 1), the input is valid
    Object.keys() gives an array back (strings) from an object; i.e. empty if no error occured
    Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
  */
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

/* 
  LoginValidation function
  Arrow function according to the ES6 standard
  Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Pfeilfunktionen
*/
module.exports.LoginValidation = (username, password) => {
  // Inititate empty errors variable (const is not immutable but rather can't be reassigned)
  const errors = {};

  // Check if username field is empty in login
  if (username.trim() === '') {
    errors.username = 'Username field is empty.';
  }

  // Check if password field is empty in login
  if (password.trim() === '') {
    errors.password = 'Password field is empty.';
  }

  /* 
    If no error happened (less than 1), the input is valid.
    Object.keys() gives an array back (strings) from an object; i.e. empty if no error occured.
    Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
  */
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
