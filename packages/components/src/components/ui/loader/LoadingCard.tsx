import React from 'react';
import PropTypes from 'prop-types';
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import HollowCard from '../HollowCard';
import FuzzyImageBackground from '../FuzzyImageBackground';

import { Subsonic, SubsonicTypes } from '@subfire/core';
import { LoadingCardPropsType } from '@subfire/hooks';
import { Box } from '@mui/material';

export const LoadingCard: React.FC<LoadingCardPropsType> = (props) => {
  const { object, top } = props;

  const styles = {
    card: {
      textAlign: 'center',
      color: 'black' // where is white coming from?
    },
    centerprogress: {
      height: 50,
      left: '50%',
      marginLeft: "-25px",
      marginTop: "0px",
      position: 'absolute',
      top: '50%',
      width: 50
    }
  };

  const { innerWidth, innerHeight } = window;
  let cellSize = innerWidth <= 600 ? innerWidth - 20 : Math.trunc(innerWidth / 2);
  cellSize = Math.min(cellSize, innerHeight - 100 - top);
  // load the one already loaded in the previous grid
  const artSize = innerWidth > 360 ? 170 : 164;
  // console.warn(object);
  const coverArt =
    object && (object.coverArt || object.id)
      ? Subsonic.getCoverArtURL(object.coverArt || object.id, artSize)
      : Subsonic.getCoverArtURL("-1", artSize);

  const loadingString =
    object && (object.name || object.title) ? object.name || object.title : "something. no really. we're loading something.";

  return (
    <div style={{ paddingTop: 25 }}>
      <FuzzyImageBackground selector=".page-bg" image={coverArt} showBackground={true} fadeBackground={true}/>
      <Grid container spacing={0}>
        <Hidden only="xs">
          <Grid item lg={3} sm={1}></Grid>
        </Hidden>
        <Grid item lg={6} sm={10} xs={12}>
          <HollowCard>
            <Typography variant="h4" sx={styles.card}>
              Loading...
            </Typography>
            <Box sx={styles.card}>
              <img alt="Loading..." src={coverArt} id="the-loading-image" style={{ width: cellSize, height: cellSize }} />
              <CircularProgress sx={styles.centerprogress} size={50} />
            </Box>
            <Typography variant="h4" sx={styles.card}>
              {loadingString}
            </Typography>
          </HollowCard>
        </Grid>
        <Hidden only="xs">
          <Grid item lg={3} sm={1}></Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

export default LoadingCard;
