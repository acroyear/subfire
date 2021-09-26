import React from 'react';
import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

import { useCredentials } from "../../hooks/CredentialsContext";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: 0
  },
  notConnected: {
    fontStyle: 'italic'
  }
}));

const ServerSelect = props => {
  const { native, labelId, fullWidth, isLoggedIn } = props;
  const classes = useStyles();

  const value = useCredentials();
  const [
    current = 'unconfigured...', // eslint-disable-line
    creds = [{ name: 'unconfigured...' }],
    currentKey,
    setNewCurrent
  ] = value;

  const className = isLoggedIn ? classes.connected : classes.notConnected;

  const handleServerChange = evt => {
    setNewCurrent(evt.target.value);
  };

  return (
    <FormControl className={classes.formControl} fullWidth={fullWidth}>
      <Select
        native={native}
        id="current-server"
        labelId={labelId}
        SelectDisplayProps={{ id: 'select-server' }}
        MenuProps={{ id: 'menu-server' }}
        value={currentKey}
        onChange={handleServerChange}
        className={className}
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

ServerSelect.propTypes = {
  native: PropTypes.bool,
  handleClose: PropTypes.func,
  labelId: PropTypes.string,
  fullWidth: PropTypes.bool,
  isLoggedIn: PropTypes.bool
};
ServerSelect.defaultProps = {
  fullWidth: true
};

export default ServerSelect;
