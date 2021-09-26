import React from 'react';

import Card from '@mui/material/Card';
import makeStyles from '@mui/styles/makeStyles';

const styles = {
  paper: {
    background: 'transparent',
    // color: common.white,
    marginLeft: 10,
    marginRight: 10
  }
};

const useStyles = makeStyles((_t: any) => {
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
