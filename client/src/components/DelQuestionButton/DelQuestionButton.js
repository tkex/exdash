import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

// DeleteButton functional component
// Input: Takes the prop questionId from Posts.js
export default function DelQuestionButton({ questionId }) {
  // useState hook for confirmDialog (initial value false)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate
  const [confirmOpen, setConfirmOpen] = useState(false);

  // useMutation hook to execute the GraphQL question delete mutation (EOF)
  // Reference: https://www.apollographql.com/docs/react/data/mutations/
  const [deleteQuestion] = useMutation(DELETE_QUESTION_MUTATION, {
    // Display eventual errors that could have occured by executing the mutation
    // Reference: https://www.apollographql.com/docs/react/data/error-handling/
    onError: ({ networkError, graphQLErrors }) => {
      console.log('graphQLErrors', graphQLErrors);
      console.log('networkError', networkError);
    },

    // Update the cache with the result after mutationon
    // Here, set the confirm dialog as false and close it
    update() {
      setConfirmOpen(false);
    },

    // Variable object containing the parameter value from the GraphQL query string
    variables: {
      questionId,
    },
  });

  return (
    <div>
      <IconButton aria-label="delete">
        {/* When delete icon is clicked, set confirmDialog state (open dialog) */}
        <DeleteIcon onClick={() => setConfirmOpen(true)} />
      </IconButton>

      <ConfirmDialog
        title="Frage löschen"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={deleteQuestion}
      >
        Wirklich löschen?
      </ConfirmDialog>
    </div>
  );
}

// GraphQL delete question mutation
// Takes as parameter the questionId which will be  provided in a variable to the useMutation hook (above)
// Reference: https://www.apollographql.com/docs/react/data/mutations/
const DELETE_QUESTION_MUTATION = gql`
  mutation deleteQuestion($questionId: ID!) {
    deleteQuestion(questionId: $questionId)
  }
`;
