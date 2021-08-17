import React from 'react';
import { useWindowSize } from 'react-use';
import Grid from '@material-ui/core/Grid';

import { Portrait, Landscape, PortraitGrid, LandscapeGrid, isPortrait, isLandscape } from './index';

export default {
  title: 'ui/orientation'
};

export const OrientationDemo = props => {
  const state = useWindowSize();

  return (
    <>
      <p>visible both</p>
      <Portrait>
        <p>portrait</p>
      </Portrait>
      <Landscape>
        <p>landscape</p>
      </Landscape>
      <Grid container>
        <Grid item xs={12}>
          This is always visible
        </Grid>
        <LandscapeGrid item xs={12}>
          This is LandscapeGrid visible
        </LandscapeGrid>
        <PortraitGrid item xs={12}>
          This is PortraitGrid visible
        </PortraitGrid>
      </Grid>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <pre>{`isPortrait? ${isPortrait(state)}`}</pre>
      <pre>{`isLandscape? ${isLandscape(state)}`}</pre>
    </>
  );
};
