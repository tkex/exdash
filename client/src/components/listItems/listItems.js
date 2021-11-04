import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import HelpIcon from '@material-ui/icons/Help';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';

/**
 * List component to provide the navigation entries and additional links in the Dashboard component
 * The listItem component is part of the Dashboard layout as a free useable react template from Material UI
 * This layout was customized to own needs for the sake of a fast developing prototype
 * Reference: https://material-ui.com/getting-started/templates/
 * Reference: https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/dashboard
 */

// Navigation list items
export const mainListItems = (
  <div>
    <ListSubheader inset>Interne Links</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <HelpIcon />
      </ListItemIcon>
      <ListItemText primary="Fragen" component={Link} to="/" />
    </ListItem>

    <ListItem button component={Link} to="">
      <ListItemIcon>
        <FiberNewIcon />
      </ListItemIcon>
      <ListItemText primary="Lorem ipsum" />
    </ListItem>
  </div>
);

// Link list items
export const secondaryListItems = (
  <div>
    <ListSubheader inset>Externe Links</ListSubheader>
    <ListItem button component="button" target="_blank" href="https://www.youtube.com/">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Youtube" />
    </ListItem>

    <ListItem button component="button" target="_blank" href="">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Lorem ipsum" />
    </ListItem>

    <ListItem button component="button" target="_blank" href="">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Lorem ipsum" />
    </ListItem>

    <ListItem button component="button" target="_blank" href="">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Lorem ipsum" />
    </ListItem>
  </div>
);
