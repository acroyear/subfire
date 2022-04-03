import React from 'react';
import ReactDOM from 'react-dom';
import { action } from '@storybook/addon-actions';
import PlayArrow from '@mui/icons-material/PlayArrow';

import { Playlist, Subsonic } from '@subfire/core';
import { SubsonicGridList } from '../..';
import { buildProcessEnvCredentials } from '@subfire/hooks';
import { ImageSlide } from './ImageSlide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

export default {
  title: 'ui/CardLists'
};

function getSubTitle(pl: Playlist) {
  const rv = pl.songCount + ' songs';
  return rv;
}

export const ImageList = () => {
  async function f() {
    const { server, username, password, bitrate, name = 'SubsonicStorybook' } = buildProcessEnvCredentials();
    const p = Subsonic.open(server, username, password, bitrate, name);
    await p;
    const res2 = await Subsonic.getPlaylists().then(Subsonic.categorizePlaylists);
    const pl = res2.myPlaylists;
    console.log(pl);

    const onClick = action('clicked'),
      onImageClick = action('image clicked');

    const newContent = (
      <>
        <SubsonicGridList
          getSubTitle={getSubTitle}
          Icon={PlayArrow}
          content={pl}
          onClick={onClick}
          onImageClick={onImageClick}
          ScrollToTop
        />
      </>
    );
    ReactDOM.render(newContent, document.getElementById('playlists-id'));
  }
  f().catch(err => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById('playlists-id'));
  });

  return <div id="playlists-id">Loading...</div>;
};

export const ImageSplide = () => {
  async function f() {
    const { server, username, password, bitrate, name = 'SubsonicStorybook' } = buildProcessEnvCredentials();
    const p = Subsonic.open(server, username, password, bitrate, name);
    await p;
    const res2 = await Subsonic.getPlaylists().then(Subsonic.categorizePlaylists);
    const pl = res2.myPlaylists;
    console.log(pl);

    const onClick = action('clicked'),
      onImageClick = action('image clicked');

    const newContent = (
      <>
        <ImageSlide
          getSubTitle={getSubTitle}
          Icon={PlayArrow}
          content={pl}
          onClick={onClick}
          onImageClick={onImageClick}
          ScrollToTop
        />
      </>
    );
    ReactDOM.render(newContent, document.getElementById('playlists-id'));
  }
  f().catch(err => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById('playlists-id'));
  });

  return <div id="playlists-id">Loading...</div>;
};
