import React, { useEffect, useState } from 'react';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import GradeIcon from '@material-ui/icons/Grade';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// FavoriteButton functional component
// Input: Takes props primary from the Posts component
// and used in the Dashboard
export default function FavoriteButton({ user, question: { id, favorites, favoriteCount } }) {
  // useState hook for favoriting
  // Initial value false (question not favorited)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate)
  const [favorited, setFavorited] = useState(false);

  // useEffect hook to initialize component state before rendering
  // Used to load the favorited questions before the rendering happens
  // Reference:: https://reactjs.org/docs/hooks-effect.html
  // Reference: https://reactjs.org/docs/hooks-reference.html#useeffect
  useEffect(() => {
    // If user is logged in: Check if question is (already) favorited for a single question
    // Check if the user name is in the favorite field (of the question) and if it's matching
    // with the logged in user
    // If found, update the new state (question is favorited by user)
    // FYI: Since FavButton is used in Post.js in single cards it's only necessary
    // to check if the user is in the favorite field of a question favorited
    if (user && favorites.find((favorite) => favorite.username === user.username)) {
      // Set favorite state true for displaying that question is favorited
      setFavorited(true);
    } else setFavorited(false);
  }, [user, favorites]);

  // useMutation hook to execute the GraphQL response mutation (EOF)
  // Reference: https://www.apollographql.com/docs/react/data/mutations/
  const [favoriteQuestion] = useMutation(FAVORITE_QUESTION_MUTATION, {
    // Variable contains the questionId passed from the GraphQL query string
    variables: { questionId: id },
  });

  // If user logged in:
  //  (1)If favorited: Show FavButton badge in blue (onClick unfavorites it) and display amount of favs
  //  (2)else (not favorited): do not display and color badge, click favorites it
  // Else: Link (not logged user) to the login page
  // Reference: enary Operator: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const favButton = user ? (
    favorited ? (
      <IconButton color="inherit">
        <Badge badgeContent={favoriteCount} color="secondary">
          <GradeIcon onClick={favoriteQuestion} color="primary" />
        </Badge>
      </IconButton>
    ) : (
      <IconButton color="inherit">
        <Badge badgeContent={favoriteCount} color="secondary">
          <GradeIcon onClick={favoriteQuestion} />
        </Badge>
      </IconButton>
    )
  ) : (
    <IconButton color="inherit" href={`/login`}>
      <GradeIcon />
    </IconButton>
  );

  return favButton;
}

// GraphQL favorite question mutation
// Mutation take as one mandatory questionID parameter  and will save the value as variable
// ID value will be contained in a variable automatically provided to the useMutation hook (above)
// Reference: https://www.apollographql.com/docs/react/data/mutations/
const FAVORITE_QUESTION_MUTATION = gql`
  mutation favoriteQuestion($questionId: ID!) {
    favoriteQuestion(questionId: $questionId) {
      id
      favorites {
        id
        username
      }
      favoriteCount
    }
  }
`;
