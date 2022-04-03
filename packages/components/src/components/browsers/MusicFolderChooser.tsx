import React from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import { useSubsonic } from '@subfire/hooks';
import { NativeSelect } from '@mui/material';
import { MusicFolder } from '@subfire/core';

export interface MusicFolderChooserPropTypes {
  caption?: string
  native?: boolean
  musicFolderId?: number
  musicFolderChanged?: (id: number) => void
  musicFolders?: Array<MusicFolder>
  selectId?: string
}

export const MusicFolderPicker: React.FC<MusicFolderChooserPropTypes> = props => {
  // props:
  // musicFolder (id)
  // musicFolders
  // musicFolderChanged (optional)
  const { caption, native, musicFolderId, musicFolderChanged, selectId } = props;
  const theRest: Record<string, any> = {};

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

  const SelectComponent = native ? NativeSelect : Select;
  if (!native) theRest.displayEmpty = true;

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{caption}</InputLabel>
      <SelectComponent
        labelId={labelId}
        native={native}
        value={musicFolderId}
        onChange={handleChange}
        id={selectId}
        label={caption}
        {...theRest}
      >
        {folderItems}
      </SelectComponent>
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
