import React from 'react';
import Grid from '@mui/material/Grid';
import { useWindowSize } from 'react-use';

export const LandscapeGrid = (props) => {
  const state = useWindowSize();
  if (state.width < state.height) return null;

  const { children, ...rest} = props; // eslint-disable-line
  return <Grid {...rest}>{children}</Grid>;
};

export default LandscapeGrid;
