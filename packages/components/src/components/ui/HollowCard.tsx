import React from 'react';

import Card from '@mui/material/Card';

export const HollowCard: React.FC = props => {
  const styles = {
    paper: {
      background: 'transparent',
      // color: common.white,
      marginLeft: 10,
      marginRight: 10
    }
  };
  return (
    <Card raised sx={styles.paper}>
      {props.children}
    </Card>
  );
};

export default HollowCard;
