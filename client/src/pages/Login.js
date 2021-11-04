import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LoadSpinner from '../components/LoadSpinner/LoadSpinner';
import { AuthContext } from '../helpers/auth';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

/**
 * The Login page layout is based on a free useable react template from Material UI
 * This layout was customized to own needs for the sake of a fast developing prototype
 * Reference: https://material-ui.com/getting-started/templates/
 * Reference: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-in
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
    width: '100%', // Fix IE 11 issue
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login(props) {
  // Apply styles
  const classes = useStyles();
  // Pass context object (AuthContext) to retrieve credential values
  // Further references to context found in auth.js
  const context = useContext(AuthContext);

  // useState hook for managing login credential state(initial values empty)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

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
  const [loginUser, { loading }] = useMutation(USERLOGIN_MUTATION, {
    // Update the cache with the result after mutation
    update(_, result) {
      //console.log(result);
      // Set login credentials with the resulted payload in context
      // Payload goes into auth.js file AuthProvider to dispatch login action for new state
      context.login(result.data.login);
      // Redirect to dashboard
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

  const [errors, setErrors] = useState({});

  // Input Submit handler
  const onSubmit = (event) => {
    // Prevent reload after submit
    event.preventDefault();
    // Execute mutation (trigger useMutation)
    loginUser();
  };

  // If still loading...
  if (loading) return <LoadSpinner />;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FlashOnIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Einloggen
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Benutzername"
            name="username"
            autoComplete="username"
            value={values.username}
            onChange={onChange}
            error={errors.username ? true : false}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Einloggen
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/register" variant="body2">
                {'Noch keinen Account?'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

// GraphQL login mutation
// Login takes username and passwort and keeps them in variables
// Variables will be used then in the useMutation hook for login dispatch
const USERLOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      createdAt
      token
    }
  }
`;
