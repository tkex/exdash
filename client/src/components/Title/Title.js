import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

/**
 * Dashboard template used for prototyping from official Material-UI website
 * and customized for own needs.
 * Reference: https://material-ui.com/getting-started/templates/
 * Reference: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 */

// Props set to be able to take props from different components like the Dashboard
// For now takes no component is using this Title
export default function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {/* Show title */}
      {props.children}
    </Typography>
  );
}

// Set Title propType
Title.propTypes = {
  children: PropTypes.node,
};
