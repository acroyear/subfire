import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import common from '@material-ui/core/colors/common';

const styles = {
  paper: {
    background: 'transparent',
    color: common.white,
    marginLeft: 10,
    marginRight: 10
  }
};

const HollowCard = props => {
  return (
    <Card raised className={props.classes.paper}>
      {props.children}
    </Card>
  );
};

HollowCard.propTypes = {
  classes: PropTypes.any,
  children: PropTypes.any
}

export default withStyles(styles)(HollowCard);
