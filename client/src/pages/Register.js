import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoadSpinner from '../components/LoadSpinner/LoadSpinner';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../helpers/auth';

/**
 * The Register page layout is based on a free useable react template from Material UI
 * This layout was customized to own needs for the sake of a fast developing prototype
 * Reference: https://material-ui.com/getting-started/templates/
 * Reference: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up
 */

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register(props) {
  // Apply styles
  const classes = useStyles();
  // Pass context object (AuthContext) to retrieve credential values
  // Further references to context found in auth.js
  const context = useContext(AuthContext);

  // useState hook for managing register credential state (initial values empty)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Set credential values ('change state')
  // event.target.value retrieve the data in the input form field
  // event.target.name contains the name from then target.value attribute when form submitted
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/target
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // useMutation hook to execute the GraphQL user login mutation (EOF)
  // Reference: https://www.apollographql.com/docs/react/data/mutations/
  const [registerUser, { loading }] = useMutation(ADDUSER_MUTATION, {
    // Update the cache with the result after mutationon
    update(_, result) {
      //console.log(result);
      // Set login credentials with the resulted payload in context when registering
      // Payload goes into auth.js file AuthProvider to dispatch register action for new state
      context.register(result.data.register);
      // Redirect user to Dashboard
      props.history.push('/');
    },

    // Display eventual errors that could have occured by executing the mutation
    // Takes only the first error element of the GraphQL error array and displays it
    // Reference: https://www.apollographql.com/docs/react/data/error-handling/
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },

    // Variable object containing all login credentials needed for execution
    // Passed down as parameters from the login GraphQL query
    variables: values,
  });

  // Input Submit handler
  const onSubmit = (event) => {
    // Prevent reload after submit
    event.preventDefault();
    // Execute mutation (trigger useMutation)
    registerUser();
  };

  // If still loading...
  if (loading) return <LoadSpinner />;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Account erstellen
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Benutzername"
                autoFocus
                value={values.username}
                onChange={onChange}
                error={errors.username ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Addresse"
                name="email"
                autoComplete="email"
                onChange={onChange}
                error={errors.email ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Passwort"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={onChange}
                error={errors.password ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Passwort bestätigen"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                value={values.confirmPassword}
                onChange={onChange}
                error={errors.password ? true : false}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrieren
          </Button>

          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Besitzt du bereits einen Account?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

// GraphQL register mutation to create a new account
// Set String values after passed values in registerInput and return them
// Values will be contained in a variable automatically provided to the useMutation hook
// Reference: https://www.apollographql.com/docs/react/data/mutations/
const ADDUSER_MUTATION = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      createdAt
      token
    }
  }
`;
