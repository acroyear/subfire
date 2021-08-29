import React from 'react';

import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import common from '@material-ui/core/colors/common';

const styles = {
  paper: {
    background: 'transparent',
    color: common.white,
    marginLeft: 10,
    marginRight: 10
  }
};

const useStyles = makeStyles((_t) => {
  return styles;
})

export const HollowCard: React.FC = props => {
  const classes = useStyles();
  return (
    <Card raised className={classes.paper}>
      {props.children}
    </Card>
  );
};

export default HollowCard;
