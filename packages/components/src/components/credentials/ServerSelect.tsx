import React from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

import { useCredentials } from "@subfire/hooks";
import { SxProps, Theme } from '@mui/material/styles';

const useSxStyles = ((): Record<string, SxProps<Theme>> => ({
  formControl: {
    margin: 0
  },
  notConnected: {
    fontStyle: 'italic'
  }
}));

export const ServerSelect = (props: { native?: any; labelId?: any; fullWidth?: any; isLoggedIn: any; }) => {
  const { native, labelId, fullWidth = true, isLoggedIn } = props;
  const sx = useSxStyles();

  const value = useCredentials();
  const [
    current = 'unconfigured...', // eslint-disable-line
    creds = [{ name: 'unconfigured...' }],
    currentKey,
    setNewCurrent
  ] = value;

  const selectSx = isLoggedIn ? sx.connected : sx.notConnected;

  const handleServerChange = (evt: { target: { value: string; }; }) => {
    setNewCurrent(evt.target.value);
  };

  return (
    <FormControl sx={sx.formControl} fullWidth={fullWidth}>
      <Select
        native={native}
        id="current-server"
        labelId={labelId}
        SelectDisplayProps={{ id: 'select-server' }}
        MenuProps={{ id: 'menu-server' }}
        value={currentKey}
        onChange={handleServerChange}
        sx={selectSx}
      >
        {Object.entries(creds).map(o => {
          if (native)
            return (
              <option key={o[0]} value={o[0]}>
                {o[1].name}
              </option>
            );
          return (
            <MenuItem key={o[0]} value={o[0]}>
              {o[1].name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

// ServerSelect.propTypes = {
//   native: PropTypes.bool,
//   handleClose: PropTypes.func,
//   labelId: PropTypes.string,
//   fullWidth: PropTypes.bool,
//   isLoggedIn: PropTypes.bool
// };
// ServerSelect.defaultProps = {
//   fullWidth: true
// };

export default ServerSelect;
