import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useWindowSize, useComponentSize } from '../../ui/orientation'
import classnames from 'classnames';

import makeStyles from '@mui/styles/makeStyles';
import IconButton from '@mui/material/IconButton';
import Eject from '@mui/icons-material/Eject';

import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import ArrowForward from '@mui/icons-material/ArrowForward';

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/FormatListBulleted';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import CurrentSongList from 'subfirelib/browsers/songs/CurrentSongList';

import { Th6, Tb1, Tb2, Tc, B, Gc, Gi } from '../../ui/TGB';
import CurrentSongList from '../../browsers/songs/CurrentSongList';
import { ThePlayerComponents } from '../ThePlayer';
import { PlayerState, SubsonicTypes } from '@subfire/core';
/* eslint react/prop-types: 0 */

const useStyles = makeStyles(theme => ({
  portratPlayer: {
    display: 'flex',
    position: 'fixed',
    top: 72,
    height: 'calc(100% - 72px - 50px)',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingTop: 15,
    paddingBottom: 35,
    width: '100%'
  },
  listHeader: {

  },
  caption: {

  },
  menuButton: {

  },
  appbar: {
    maxHeight: 72
  },
  flex: {
    flex: 1,
    color: 'inherit'
  },
  grid: {
    flex: '0 1 auto'
  },
  title: {
    color: 'inherit'
  },
  list: {
    position: 'relative',
    overflow: 'auto'
  },
  closeButton: {
    backgroundColor: '#000000'
  },
  songListItem: {
    maxWidth: 352
  },
  selectedSongListItem: {
    maxWidth: 352,
    fontStyle: 'italic',
    marginLeft: 10
  },
  secondaryActionButtonsCentered: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    // background: theme.palette.secondary.main,
    // color: theme.palette.secondary.contrastText
  },
  actionButtons: {
    // position: 'absolute',
    // width: '80%',
    // left: '10%',
    // bottom: theme.spacing(5),
    display: 'flex',
    justifyContent: 'space-evenly',
    flex: '0 0 auto'
  },
  actionButtonsLeft: {
    // position: 'absolute',
    // width: '80%',
    // left: '3%',
    // bottom: theme.spacing(5),
    display: 'flex',
    justifyContent: 'start',
    flex: '0 0 auto'
  },
  left: {
    display: 'block'
  },
  right: {
    display: 'block',
    textAlign: 'right'
  },
  songList: {
    width: '85vw',
    maxWidth: '85vw'
  }
}));

export const PortraitPlayer = (components: ThePlayerComponents, current: SubsonicTypes.Song, queue: SubsonicTypes.SongList): JSX.Element => {
  const c = components;
  const cp = current;
  const q = queue;

  const [slideLeft, setSlideLeft] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false); // eslint-disable-line
  const imageRef = useRef();
  // const [divRef] = useImageFit(imageRef);
  // console.log(divRef);
  const size = useComponentSize(imageRef);
  // const { setImageTag } = useImageColorTheme();
  const currentImageTag = imageRef.current;

  // const { CastButton } = c; 
  const paused = components.state === PlayerState.PAUSED;
  const history = useHistory();
  const classes = useStyles();
  const goBack = () => history.goBack();
  const handleDrawer = () => setPlaylistOpen(true);
  const handleClose = () => setPlaylistOpen(false);
  const toggleSlideLeft = () => setSlideLeft(slideLeft => !slideLeft);

  /*           <CastSubsonic {...subProps}>
              <ChromecastButton {...subProps} />
            </CastSubsonic>
            <RemoteReceiverToggleButton {...subProps} />
  */

  // useEffect(() => {
  //   if (paused) {
  //     document.querySelector('.page-bg').classList.add('faded');
  //   } else {
  //     document.querySelector('.page-bg').classList.remove('faded');
  //   }
  //   return () => {
  //     const pagebg = document.querySelector('.page-bg');
  //     if (pagebg) pagebg.classList.remove('faded');
  //   };
  // }, [paused]);

  const coverSize = size.width - 32;
  // console.log(coverSize);

  const imageLoadHandler = (_evt: any) => {
    // if (setImageTag) {
    //   setImageTag({ tag: currentImageTag });
    // }
  };

  return <>
    <AppBar className={classes.appbar}>
      <Toolbar>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          onClick={goBack}
          size="large">
          <Eject />
        </IconButton>
        <Th6 className={classes.flex}>
          <span id="title-span" className={classes.title}>
            {queue.name || 'SubFire Mobile 3'}
          </span>
        </Th6>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          onClick={handleDrawer}
          size="large">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <div className={classes.portratPlayer}>
      <div
        style={{
          width: '100%',
          height: '60%',
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'start'
        }}
        onClick={toggleSlideLeft}
      >
        {c.artwork(coverSize, imageRef, imageLoadHandler, 'image-shadow')}
      </div>
      <Gc className={classes.grid}>
        <Gi xs={1} />
        <Gi xs={10}>{c.slider}</Gi>
        <Gi xs={1} />

        <Gi xs={1} />
        <Gi xs={5}>
          <Tc className={classnames(classes.left, classes.caption)}>{c.currentTime}</Tc>
        </Gi>
        <Gi xs={5}>
          <Tc className={classnames(classes.right, classes.caption)}>{c.duration}</Tc>
        </Gi>
        <Gi xs={1} />

        <Gi xs={1} />
        <Gi xs={7}>
          <Tb1>{cp.title}</Tb1>
        </Gi>
        <Gi xs={3} />
        <Gi xs={1} />

        <Gi xs={1} />
        <Gi xs={7}>
          <Tb2>{cp.artist}</Tb2>
        </Gi>
        <Gi xs={3}>
          <Tc className={classnames(classes.right, classes.caption)}>
            {components.queuePosition}
          </Tc>
        </Gi>
        <Gi xs={1} />

        <Gi xs={1} />
        <Gi xs={7}>
          <Tb2>{cp.album}</Tb2>
        </Gi>
        <Gi xs={3}>
          <Tc className={classnames(classes.right, classes.caption)}>({cp.year})</Tc>
        </Gi>
        <Gi xs={1} />
      </Gc>
      <div
        style={{
          flexGrow: 1
        }}
      ></div>
      <Gc className={classes.grid}>
        <Gi xs={12}>
          <div className={slideLeft ? classes.actionButtonsLeft : classes.actionButtons}>
            {c.volumeButtonAbove}
            {c.prevButton}
            {c.back10Button}
            {c.playPauseButton}
            {c.skip30Button}
            {c.nextButton}
          </div>
        </Gi>
      </Gc>
    </div>
    <SwipeableDrawer open={Boolean(playlistOpen)} onClose={handleClose} onOpen={handleDrawer} anchor="right">
      <ListSubheader component="div" className={classes.listHeader}>
        <B flexDirection="row" alignItems="center">
          {c.bookmarkButton}
          {c.playQueueButton}
          {c.skipAlbumButton}
          {c.shuffleQueueButton}
          <div style={{ flex: '1 0 auto' }}></div>
          <Button onClick={handleClose}>
            Close
            <ArrowForward />
          </Button>
        </B>
      </ListSubheader>
      <CurrentSongList className={classes.songList} onSongClick={handleClose} />
    </SwipeableDrawer>
  </>;
}

export default PortraitPlayer;
