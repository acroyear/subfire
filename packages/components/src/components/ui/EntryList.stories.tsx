import React from 'react';
import ReactDOM from 'react-dom';
import { action } from '@storybook/addon-actions';
import PlayArrow from '@mui/icons-material/PlayArrow';

import { Generic, Playlist, Subsonic } from '@subfire/core';
import EntryList from './EntryList';
import { buildProcessEnvCredentials } from '@subfire/hooks';

export default {
  title: 'ui/EntryList'
};

function getSubTitle(g: Generic): string {
  const pl = g as Playlist
  const rv = pl.songCount + ' songs';
  return rv;
}

export const EntryListContents = () => {
  async function f() {
    const { server, username, password, bitrate, name = 'SubsonicStorybook' } = buildProcessEnvCredentials();
    const p = Subsonic.open(server, username, password, bitrate, name);
    await p;
    const res2 = await Subsonic.getPlaylists().then(Subsonic.categorizePlaylists);
    const pl = res2.myPlaylists;

    const onClick = action('clicked'),
      onImageClick = action('image clicked');

    const newContent = (
      <>
        <EntryList
          getSubTitle={getSubTitle}
          Icon={PlayArrow}
          content={pl}
          onEntrySecondaryClick={onClick}
          onEntryClick={onImageClick}
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
