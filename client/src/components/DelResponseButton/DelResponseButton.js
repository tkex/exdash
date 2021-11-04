import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import ConfirmButton from '../ConfirmDialog/ConfirmDialog';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

// DelResponseButton functional component
// Inpurt: Takes the questionId and the responseId passed as props from SingleQuestion component
// Reference: https://reactjs.org/docs/components-and-props.html
export default function DelResponseButton({ questionId, responseId }) {
  // useState hook for confirmDialog (initial value false)
  // Reference: https://reactjs.org/docs/hooks-reference.html#usestate
  const [confirmOpen, setConfirmOpen] = useState(false);

  // useMutation hook to execute the GraphQL question delete a reponse (EOF)
  // Reference: https://www.apollographql.com/docs/react/data/mutations/
  const [deleteResponse] = useMutation(RESPONSE_DELETE_MUTATION, {
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

    // Variable object containing the parameter values from the GraphQL query string
    variables: {
      questionId,
      responseId,
    },
  });

  return (
    <div>
      <IconButton aria-label="delete">
        {/* When delete icon is clicked, set confirmDialog state (open dialog) */}
        <DeleteIcon onClick={() => setConfirmOpen(true)} fontSize="small" />
      </IconButton>

      <ConfirmButton
        title="Kommentar löschen"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={deleteResponse}
      >
        Kommentar wirklich löschen?
      </ConfirmButton>
    </div>
  );
}

// GraphQL delete a reponse mutation
// Takes as parameter the questionId and responseId which
// will be  provided in a variable to the useMutation hook (above)
// Reference: https://www.apollographql.com/docs/react/data/mutations/
const RESPONSE_DELETE_MUTATION = gql`
  mutation deleteResponse($questionId: ID!, $responseId: ID!) {
    deleteResponse(questionId: $questionId, responseId: $responseId) {
      id
      responses {
        id
        username
        createdAt
        body
      }
      responseCount
    }
  }
`;
