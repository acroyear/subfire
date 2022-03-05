import React from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import { SubsonicTypes } from '@subfire/core';
import { useSubsonic } from '@subfire/hooks';

export interface MusicFolderChooserPropTypes {
  caption?: string
  native?: boolean
  musicFolderId?: number
  musicFolderChanged?: (id: number) => void
  musicFolders?: Array<SubsonicTypes.MusicFolder>
  selectId?: string
}

export const MusicFolderPicker: React.FC<MusicFolderChooserPropTypes> = props => {
  // props:
  // musicFolder (id)
  // musicFolders
  // musicFolderChanged (optional)
  const { caption, native, musicFolderId, musicFolderChanged, selectId } = props;
  let { musicFolders } = props;
  if (musicFolders.length === 0) musicFolders = [{ id: -1, name: "still loading..." }];
  const labelId = `${selectId}-label`;
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
      <InputLabel id={labelId}>{caption}</InputLabel>
      <Select
        labelId={labelId}
        native={native}
        value={musicFolderId}
        onChange={handleChange}
        id={selectId}
        label={caption}
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
      selectId={props.selectId}
      caption={props.caption}
      native={props.native}
      musicFolderId={musicFolderId}
      musicFolders={MusicFolders}
      musicFolderChanged={setMusicFolderId}
    />
  );
};

export default MusicFolderChooser;
