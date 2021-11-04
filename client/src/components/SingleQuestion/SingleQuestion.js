import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../../helpers/auth';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import DelResponseButton from '../../components/DelResponseButton/DelResponseButton';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';

/**
 * Component for a single question
 * Displayed after one clicks for more details on a question
 * Enables to show more details of specific question and commenting it
 */

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
  media: {
    height: 150,
  },
});

// Functional component SingleQuestion
// Input: Enable to take route params (dynamic values) via React-Router-DOM from the URL
// This components takes the param :questionId (see App.js)
// The dynamic value given as a prop in the Posts component
export default function SingleQuestion(props) {
  const classes = useStyles();

  // Get value from questionId from the parsed prop (via react-router-dom)
  // Match is an object containing another object params
  // params is another object (key/value) parsed from the URL (like defined in App.js)
  // containg the unique questionId
  // Reference: https://reactrouter.com/web/api/match
  const questionId = props.match.params.questionId;

  // Pass context object (AuthContext) to retrieve credential values
  // Further references to context found in auth.js
  const { user } = useContext(AuthContext);

  // useQuery hook to fetch a single question (getting and showinf the question details)
  // Loading and error for displaying status, data for displaying the content of the Query
  // Reference: https://www.apollographql.com/docs/react/data/queries/
  const { loading, data } = useQuery(FETCH_QUESTION_QUERY, {
    // Containing all the data from the GraphQL query string (below)
    variables: { questionId },
  });

  // useState hook to response to a question (initial value empty)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate
  const [response, setResponse] = useState('');

  // useMutation hook to execute the GraphQL response mutation (EOF)
  // Reference: https://www.apollographql.com/docs/react/data/mutations/
  const [submitResponse] = useMutation(RESPONSE_SUBMIT_MUTATION, {
    // Update the cache with the result after mutationon
    update() {
      setResponse('');
    },

    // Variable object containing all response data needed for execution
    // Passed down as parameters from the response GraphQL string query (EOF)
    variables: {
      questionId,
      body: response,
    },
  });

  // If data is still loading...
  if (loading) return 'Lade die Details...';

  return (
    <Card className={classes.root}>
      <CardContent>
        {/* The body of the card (content) */}
        <Typography gutterBottom>
          {data.getQuestion.username} (Ersteller)
          <Typography variant="body2" color="textSecondary" component="p">
            {moment(data.getQuestion.createdAt).fromNow()}
          </Typography>
          <Divider />
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          Beschreibung:
        </Typography>

        {/* The body of the card (content) */}
        <Typography variant="body2" color="textSecondary" component="p">
          {data.getQuestion.body}
        </Typography>
      </CardContent>

      {/* If user is logged in and question belong to user: show delete button 
        <CardActions>
        {user && user.username === data.getQuestion.username && (
          <DelQuestionButton questionId={data.getQuestion.id} justify="right" />
        )}
      </CardActions>
      */}

      {/* Input Response */}
      {user && (
        <div>
          <Divider />
          <TextField
            multiline
            rows={3}
            fullWidth="true"
            type="text"
            placeholder="Kommentieren..."
            name="response"
            value={response}
            onChange={(event) => setResponse(event.target.value)}
          />
          {/* onChange: Set new response state with data from input field */}
          <Divider />
          {/* disabled: When button empty show it as disabled */}
          {/* onClick: useMutation hook when button submitted */}
          <Button
            type="submit"
            disabled={response.trim() === ''}
            onClick={submitResponse}
            color="primary"
          >
            Kommentar absenden
          </Button>
        </div>
      )}
      <Divider />

      {/* Display all responses (iterating over queried getQuestion array) */}
      {data.getQuestion.responses.map((response) => (
        <Card key={response.id}>
          <CardContent>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <Typography gutterBottom>
                  {response.username}
                  <Typography variant="body2" color="textSecondary" component="p">
                    ({moment(response.createdAt).fromNow()})
                  </Typography>
                </Typography>
              </Grid>
              <Grid item>
                {/*
              Delete Response Button
              Showed only when user is logged and and response is owned by user
              Props (giving to DelResponseButton): questionId and responseId
             */}
                {user && user.username === response.username && (
                  <DelResponseButton
                    questionId={data.getQuestion.id}
                    responseId={response.id}
                    justify="right"
                  />
                )}
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="body2" color="textSecondary" component="p"></Typography>

            {/* The body of the card (content) */}
            <Typography variant="body2" color="textSecondary" component="p">
              {response.body}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Card>
  );
}

/* 
  Fetch Question Query: Get a single question from the backend API over the specific ID.
*/

// GraphQL query for getting a single question from the endpoints over a specific question ID
// The GraphQL query string is passed in the useQuery hook above
// Every parsed value will be shown (displayed) once iterated over the provided array
// Reference: https://www.apollographql.com/docs/react/data/queries/
const FETCH_QUESTION_QUERY = gql`
  query($questionId: ID!) {
    getQuestion(questionId: $questionId) {
      id
      body
      createdAt
      username
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

// GraphQL response submit mutation to create a response to a question
// Mutation takes two mandatory parameter as String and will save the values as variables
// Values will be contained in a variable automatically provided to the useMutation hook (above)
// Reference: https://www.apollographql.com/docs/react/data/mutations/
const RESPONSE_SUBMIT_MUTATION = gql`
  mutation($questionId: String!, $body: String!) {
    createResponse(questionId: $questionId, body: $body) {
      id
      responses {
        id
        username
        body
        createdAt
      }
      responseCount
    }
  }
`;
