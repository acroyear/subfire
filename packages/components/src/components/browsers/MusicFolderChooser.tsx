import React from 'react';
import PropTypes from 'prop-types';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import { SubsonicTypes } from '@subfire/core';
import { useSubsonic } from '../../hooks/SubsonicContext';

export interface MusicFolderChooserPropTypes {
  caption?: string
  native?: boolean
  musicFolderId?: number
  musicFolderChanged?: (id: number) => void
  musicFolders?: Array<SubsonicTypes.MusicFolder>
}

export const MusicFolderPicker: React.FC<MusicFolderChooserPropTypes> = props => {
  // props:
  // musicFolder (id)
  // musicFolders
  // musicFolderChanged (optional)
  const { caption, native, musicFolderId, musicFolderChanged } = props;
  let { musicFolders } = props;
  if (musicFolders.length === 0) musicFolders = [{ id: -1, name: "still loading..." }];

  const handleChange = (evt: any) => {
    musicFolderChanged(evt.target.value);
  };

  const folderItems = musicFolders.map(m => {
    if (native)
      return (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      );
    return (
      <MenuItem key={m.id} value={m.id}>
        {m.name}
      </MenuItem>
    );
  });

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="folder-query-select">{caption}</InputLabel>
      <Select
        native={native}
        value={musicFolderId}
        onChange={handleChange}
        input={<Input name="folder-query" id="folder-query-select" />}
      >
        {folderItems}
      </Select>
    </FormControl>
  );
};

MusicFolderPicker.defaultProps = {
  caption: 'Music Folder',
  native: false,
  musicFolderId: -1,
  musicFolders: [],
  musicFolderChanged: () => {
    console.warn('no callback');
  }
};

export const MusicFolderChooser: React.FC<MusicFolderChooserPropTypes> = props => {
  const { musicFolderId, setMusicFolderId, SubsonicCache } = useSubsonic();
  const { MusicFolders } = SubsonicCache;
  return (
    <MusicFolderPicker
      caption={props.caption}
      native={props.native}
      musicFolderId={musicFolderId}
      musicFolders={MusicFolders}
      musicFolderChanged={setMusicFolderId}
    />
  );
};

export default MusicFolderChooser;