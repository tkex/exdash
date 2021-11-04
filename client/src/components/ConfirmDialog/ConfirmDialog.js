import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 * This component implements the ConfirmDialog
 * Opens when a question or reponse is going to be deleted
 * In use in the components DelQuestionButton  and DelResponseButton
 * Reference: https://material-ui.com/components/dialogs/
 */

// ConfirmButton function component
// Input: Takes props from the above mentioned components
// Reference: https://reactjs.org/docs/components-and-props.html
export default function ConfirmButton({ title, children, open, setOpen, onConfirm }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      {/* The title */}
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      {/* The body */}
      <DialogContent>{children}</DialogContent>
      {/* Dialog and Buttons */}
      {/* When confirmed: execute the passed and defined function from the parent component */}
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="secondary"
        >
          Ja!
        </Button>

        <Button variant="contained" onClick={() => setOpen(false)} color="default">
          Nein!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
