import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import { AuthContext } from '../../helpers/auth';
import FavButton from '../FavButton/FavButton';
import DelQuestionButton from '../DelQuestionButton/DelQuestionButton';
// Moment to set up date format
import moment from 'moment';
import 'moment/locale/de';
moment.locale('de');

/**
 * Component for displaying the cards on the Dashboard
 * This component is used in the Dashboard component
 * The user has to be logged in to be able to see this component
 *
 * In this component Material UI cards are heavily used and taken from the examples
 * from the official website and customized to own needs
 * Reference: https://material-ui.com/components/cards/
 * Reference: https://material-ui.com/api/card/
 */

const useStyles = makeStyles((theme) => ({
  root: {
    // Set width
    maxWidth: 350,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    // Expand configurations
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    // Option when expanding the arrow f.e. rotate arrow 180 degrees
    transform: 'rotate(180deg)',
  },
  question: {
    // Set question avatar as blurry red
    backgroundColor: red[200],
  },
}));

// Functional component Posts
// Input: Taking all props from the parent component Dashboard (deconstructed)
// Reference: https://reactjs.org/docs/components-and-props.html
export default function Posts({
  question: {
    id,
    username,
    body,
    createdAt,
    favoriteCount,
    responseCount,
    responseQuestion,
    favorites,
  },
}) {
  // Apply styles
  const classes = useStyles();
  // Set state for expanded card (arrow to show more information)
  // Initial value for extended card is false (closed)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate)
  const [expanded, setExpanded] = React.useState(false);

  // Set state from expanded card to true (opened)
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Pass context object (AuthContext) to be able to retrieve credential values
  // Further references to context found in auth.js
  const { user } = useContext(AuthContext);

  return (
    <Card className={classes.root}>
      {/* Card Header component for displaying a WIP Avatar picture */}
      <CardHeader
        avatar={
          <Avatar aria-label="question" className={classes.question}>
            ?
          </Avatar>
        }
        title={username}
        subheader={moment(createdAt).fromNow()}
      />

      {/* Card body for the essential display of the main content */}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {/* 
          Substring for shortening the string (starting from 0 to max. 50 characters)
          Reference: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/substring
          */}
          {body.substring(0, 70) + '...'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* 
          Icon Components 
        */}

        {/* 
          FavButton component (Star Icon) 
          with passing properties to FavButton (which were received from the Dashboard component)
          Basically we get the props from the Dashboard Component, passed them as argument in the function
          header and are passing them further down the chain to FavButton.
        */}
        <FavButton user={user} question={{ id, favorites, favoriteCount }} />

        {/* 
          QuestionIcon with onClick event to the above defined function responseQuestion
        */}
        <IconButton color="inherit" href={`/questions/${id}`}>
          <Badge badgeContent={responseCount} color="secondary">
            <QuestionAnswer onClick={responseQuestion} />
          </Badge>
        </IconButton>

        {/* 
          DeleteIcon: Only shown when logged in
          Important: 'user.username' is from AuthContext while 'username' is a deconstructed prop passed down 
          prop from the Dashboard. The deconstructed attribute (prop) is defined above in the function parameter (arguments).
        */}
        {user && user.username === username && <DelQuestionButton questionId={id} />}

        {/* 
          Button to link to a detailled overview for more information
          'id' (id from a question) is used further down in App.js as a route param (dynamic value) 
          to display and etablish the unique id in the url
          This route param is used as a prop then in the component SingleQuestion 
        */}
        <CardActions>
          <Button size="big" color="primary" href={`/questions/${id}`}>
            Mehr
          </Button>
        </CardActions>

        {/* 
          Show more details
        */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Beschreibung:</Typography>
          <Typography paragraph>{body}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
