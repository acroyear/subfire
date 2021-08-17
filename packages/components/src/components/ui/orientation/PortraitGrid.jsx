import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useWindowSize } from 'react-use';

export const PortraitGrid = (props) => {
  const state = useWindowSize();
  if (state.width >= state.height) return null;

  const { children, ...rest} = props; // eslint-disable-line
  return <Grid {...rest}>{children}</Grid>;
};

export default PortraitGrid;
