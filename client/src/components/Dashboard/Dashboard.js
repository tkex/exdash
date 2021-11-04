import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Button from '@material-ui/core/Button';
import LoadSpinner from '../LoadSpinner/LoadSpinner';
import { mainListItems, secondaryListItems } from '../listItems/listItems';
import Posts from '../Posts/Posts';
import QuestionSubmitForm from '../QuestionSubmitForm/QuestionSubmitForm';
import { AuthContext } from '../../helpers/auth';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

/**
 * Main component for displaying the content of this app
 * The Dashboard layout is based on a free useable react template from Material UI
 * This layout was customized to own needs for the sake of a fast developing prototype
 *
 * Reference: https://material-ui.com/getting-started/templates/
 * Reference: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 */

// Set drawer width of the Dashboard
const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

// Footer for Dashboard
function Footer() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Exchange Dashboard (ExDash) - Prototype
      {'.'}
    </Typography>
  );
}

export default function Dashboard() {
  // Apply styles
  const classes = useStyles();
  // Set state hook for drawer
  // Initial value true (draw is open)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate)
  const [open, setOpen] = React.useState(true);

  // Set state from opened drawer to true (opened)
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  // Set state from closed drawer to false (closed)
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Get user object and logout function from AuthContext (auth.js)
  // To check if user is logged in and to be able to logout (dispatch a new state)
  // More infos in auth.js
  const { user, logout } = useContext(AuthContext);
  // useQuery hook to get loading and data object to display both
  // Reference: https://www.apollographql.com/docs/react/api/react/hooks/
  const { loading, data } = useQuery(FETCH_QUESTIONS_QUERY);

  /*
    Display followed content in brackets if you are logged in as a user
    Otherwise this tenary operator will show you different content if you are not logged in (see below)
    See: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  */
  const isLoggedIn = user ? (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            // Change state of drawer
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          ExDash.
          </Typography>

          {/* Greet user */}
          <Button color="inherit">Hallo, {user.username}!</Button>
          {/*
            Logout button with logout onClick function
            Logout function is defined in auth.js and will clear the token credentials from HTTP-Header
          */}
          <Button color="inherit" onClick={logout}>
            Ausloggen
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* Show Dashboard navigation entries*/}
        <List>{mainListItems}</List>
        <Divider />
        {/* Show Dashboard navigation links*/}
        <List>{secondaryListItems}</List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3} justify="center">
            {/*
              If user is logged in: Show QuestionForm component
            */}
            {user && (
              <Grid container justify="center">
                <QuestionSubmitForm />
              </Grid>
            )}
            {/*
              Tenary operator for displaying the content in the grid
              If data is not loaded in, show the LoadSpinner
              Otherwise map over the GraphQL array objects to list them accordingly
              Each iteration will call an own Post component while passing the prop 'question'
              to Posts (Posts.js)
            */}
            {loading ? (
              <LoadSpinner />
            ) : (
              data.getQuestions &&
              data.getQuestions.map((question) => (
                <Grid item xs={12} md={4} lg={3} key={question.id}>
                  <Posts question={question} />
                </Grid>
              ))
            )}
          </Grid>
          {/*
              Display footer in a box.
              Footer function is defined above as an own function.
            */}
          <Box pt={4}>
            <Footer />
          </Box>
        </Container>
      </main>
      {/*
        If user is not logged in...
      */}
    </div>
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            // Change state of drawer
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          ExDash
          </Typography>

          <Button color="inherit" href="/login">
            Einloggen
          </Button>

          <Button color="inherit" href="/register">
            Registrierung
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          {/* Close drawer */}
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* Show Dashboard navigation entries*/}
        <List>{mainListItems}</List>
        <Divider />
        {/* Show Dashboard navigation links*/}
        <List>{secondaryListItems}</List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3} justify="center">
            {/*
              Tenary operator for displaying the content in the grid
              If data is not loaded in, show the LoadSpinner
              Otherwise map over the GraphQL array objects to list them accordingly
              Each iteration will call an own Post component while passing the prop 'question'
              to Posts (Posts.js)
          */}
            {loading ? (
              <LoadSpinner />
            ) : (
              data.getQuestions &&
              data.getQuestions.map((question) => (
                <Grid item xs={12} md={4} lg={3} key={question.id}>
                  <Posts question={question} />
                </Grid>
              ))
            )}
          </Grid>
          {/*
            Display footer in a box.
            Footer function is defined above as an own function.
          */}
          <Box pt={4}>
            <Footer />
          </Box>
        </Container>
      </main>
    </div>
  );
  return isLoggedIn;
}

// GraphQL query for getting all question from the endpoint
// The GraphQL query string is passed in the useQuery hook above
// Every parsed value will be shown (displayed) once iterated over the provided array
// Reference: https://www.apollographql.com/docs/react/data/queries/
const FETCH_QUESTIONS_QUERY = gql`
  {
    getQuestions {
      id
      username
      body
      createdAt
      favoriteCount
      favorites {
        username
      }
      responseCount
      responses {
        id
        username
        createdAt
        body
      }
    }
  }
`;
