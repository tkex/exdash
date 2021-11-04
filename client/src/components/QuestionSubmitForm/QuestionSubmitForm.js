import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

/**
 * Component for submitting a question on the Dashboard
 * This component is used in the Dashboard component
 * The user has to be logged in to be able to see this component
 */

export default function QuestionSubmitForm() {
  // useState hook for managing register credential state (initial value for body (content of form) empty)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate
  const [values, setValues] = useState({
    body: '',
  });

  // Set credential values ('change state')
  // event.target.value retrieve the data in the input form field
  // event.target.name contains the name from then target.value attribute when form submitted
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // useMutation hook to execute the GraphQL mutation for creating a question (EOF)
  // Reference: https://www.apollographql.com/docs/react/data/mutations/
  const [createQuestion, { error }] = useMutation(CREATE_QUESTION_MUTATION, {
    // Variables hold the body value from the GraphQL query
    variables: values,

    // Update the cache with the result after mutationon
    update(_, result) {
      // console.log(result);
      // Set body value as empty string after submitted question
      values.body = '';
    },

    // Display eventual errors that could have occued by executing the mutation
    // Reference: https://www.apollographql.com/docs/react/data/error-handling/
    onError: ({ networkError, graphQLErrors }) => {
      console.log('graphQLErrors', graphQLErrors);
      console.log('networkError', networkError);
    },
  });

  // Input Submit handler
  const onSubmit = (event) => {
    // Prevent reload after submit
    event.preventDefault();
    // Execute mutation (trigger useMutation)
    createQuestion();
    // Set body value in form field after submitted question to empty string
    values.body = '';
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <Typography component="h1" variant="h5"></Typography>
        <form noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            multiline
            rows={2}
            margin="normal"
            fullWidth
            id="body"
            label="Du hast eine Frage?"
            placeholder="Du hast eine Frage? (Nach Absenden die Seite aktualisieren)"
            name="body"
            autoComplete="fname"
            onChange={onChange}
            value={values.body}
            autoFocus
            error={error ? true : false}
          />

          <Button type="submit" fullWidth variant="contained" color="primary">
            Frage absenden
          </Button>
        </form>
      </div>
    </Container>
  );
}

// GraphQL register mutation to create a new account
// The GraphQL query string is passed above in the useMutation hook
// The values are  contained in a variable automatically provided to the useMutation hook
// Reference: https://www.apollographql.com/docs/react/data/mutations/
const CREATE_QUESTION_MUTATION = gql`
  mutation createQuestion($body: String!) {
    createQuestion(body: $body) {
      id
      username
      body
      createdAt
      favorites {
        id
        username
        createdAt
      }
      favoriteCount
      responses {
        id
        username
        body
        createdAt
      }
      favoriteCount
    }
  }
`;
