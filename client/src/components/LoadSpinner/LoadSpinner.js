import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * This component is the loading spinner
 * Must be only imported in other components and be called
 * when loading data (from a GraphQL query / mutation)
 *
 * Reference: https://material-ui.com/components/progress/
 */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function LoadSpinner() {
  // Apply styles
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}
