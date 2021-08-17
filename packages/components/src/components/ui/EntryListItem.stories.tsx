import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { action } from '@storybook/addon-actions';
import { EntryListItem, EntryListItemProps } from './EntryListItem';

import Shuffle from '@material-ui/icons/Shuffle';
import List from '@material-ui/core/List';

import { Subsonic } from '@subfire/core';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook"
};

export default {
  title: 'ui/EntryListItem'
};

export const EntryList = () => {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);

  async function f() {
    const { server, username, password, bitrate, clientName = 'SubsonicStorybook' } = credentials;
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    await p;
    const pl = await Subsonic.getPlaylist("5");
    const ar = await Subsonic.getArtist("33");
    const al = await Subsonic.getAlbum("44");
    const ar2 = await Subsonic.getArtist(al.artistId);

    const evt = (id: string) => {
      console.log('calling action', id);
      action(id, { clearOnStoryChange: true });
    }

    const newContent = (<List dense={dense}>
      <EntryListItem subsonic={Subsonic} item={pl} index={pl} useAvatar onEntryClick={evt} onEntrySecondaryClick={evt}
        SecondaryIcon={Shuffle}
        secondaryActionLabel="Shuffle"
      />
      <EntryListItem subsonic={Subsonic} item={ar} index={ar} useAvatar onEntryClick={evt} onEntrySecondaryClick={evt}
        SecondaryIcon={Shuffle}
        secondaryActionLabel="Shuffle"
      />
      <EntryListItem subsonic={Subsonic} item={al} index={ar2} useAvatar onEntryClick={evt} onEntrySecondaryClick={evt}
        SecondaryIcon={Shuffle}
        secondaryActionLabel="Shuffle"
        showIndexText={secondary}
      />
    </List>);
    ReactDOM.render(newContent, document.getElementById('list-goes-here'));
  }
  f().catch((err: any) => {
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById('list-goes-here'));
  })
  return <>
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox checked={dense} onChange={(event) => setDense(event.target.checked)} />
        }
        label="Enable dense"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={secondary}
            onChange={(event) => setSecondary(event.target.checked)}
          />
        }
        label="Enable secondary text"
      />
    </FormGroup><div id="list-goes-here">loading...</div></>
}
