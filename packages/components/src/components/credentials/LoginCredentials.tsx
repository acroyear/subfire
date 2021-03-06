import React, { KeyboardEventHandler, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import { useCredentials } from '@subfire/hooks';
import { Theme, useTheme } from '@mui/material/styles';
import { Key } from 'mdi-material-ui';

const NEW = '__new__';

const useSxStyles = ( theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: 0,
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  paperFullScreen: {

  }
});

export const LoginCredentials = (props: { handleClose?: any; native?: any; }) => {
  const value = useCredentials();
  const [original, creds, originalKey, setNewCurrent, updateCreds, deleteCreds] = value; // eslint-disable-line
  const theme = useTheme();
  const styles = useSxStyles(theme);

  const [credentials, setCredentials] = useState(original);
  const [current, setCurrent] = useState(originalKey);

  const handleClose = () => {
    if (props.handleClose) props.handleClose();
  };

  const handleSubmit = () => {
    const creds = credentials;
    if (creds.server.endsWith('/')) creds.server = creds.server.substring(0, creds.server.length - 1);

    console.log('SUBMIT', current, creds);

    updateCreds(current, creds);

    handleClose();
  };

  const handleDelete = () => {
    console.log('DELETE', current);
    deleteCreds(current);
    handleClose();
  };

  const handlePasswordKeyDown: KeyboardEventHandler<HTMLDivElement> = (evt) => {
    // why oh why has there not been a js or ts constants/enum for this???
    if (evt.key === "Enter") {
      handleSubmit();
      return false;
    }
    return true;
  } ;

  const handleChangeCurrent = (e: { target: { value: string } }) => {
    setCurrent(e.target.value);
    setCredentials(
      creds[e.target.value] || {
        name: '',
        server: '',
        username: '',
        password: '',
        bitrate: '0'
      }
    );
  };

  const handleChange = (property: string) => (e: { target: { value: string } }) => {
    const creds = credentials as unknown as Record<string, string>;
    creds[property] = e.target.value;
    setCredentials({ ...credentials });
  };

  const { native } = props;
  const isDeleteDisabled = originalKey === current || current === NEW;

  const currentSelectorField = (
    <FormControl sx={styles.formControl}>
      <InputLabel htmlFor="current-selection">Current Selection</InputLabel>
      <Select
        native={native}
        id="LC_current-selection"
        value={current}
        onChange={handleChangeCurrent}
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
        console.warn(current, credentials);
        {native && (
          <option key={NEW} value={NEW}>
            {current === NEW ? credentials.name || 'New Server' : 'New Server'}
          </option>
        )}
        {!native && (
          <MenuItem key={NEW} value={NEW}>
            {current === NEW ? credentials.name || 'New Server' : 'New Server'}
          </MenuItem>
        )}
      </Select>
      <FormHelperText>{current}</FormHelperText>
    </FormControl>
  );

  let passwordValues = {label: '', value: ''};
  if (original && original.password === credentials.password) {
    passwordValues.label = 'Password: unchanged';
    passwordValues.value = '';
  } else {
    passwordValues.label = 'Password';
    passwordValues.value = credentials.password;
  }

  return (
    <Dialog open={true} sx={styles.paperFullScreen}>
      <DialogTitle>{'Server Credentials'}</DialogTitle>
      <DialogContent>
        {currentSelectorField}
        <TextField
          id="LC_name"
          label="Name"
          margin="dense"
          fullWidth
          onChange={handleChange('name')}
          value={credentials.name}
        />
        <TextField
          id="LC_server"
          label="Server"
          margin="dense"
          helperText="http(s)://host:port"
          fullWidth
          onChange={handleChange('server')}
          value={credentials.server}
        />
        <TextField
          id="LC_username"
          label="Username"
          margin="dense"
          fullWidth
          onChange={handleChange('username')}
          value={credentials.username}
        />
        <TextField
          id="LC_password"
          type="password"
          margin="dense"
          fullWidth
          onChange={handleChange('password')}
          onKeyDown={handlePasswordKeyDown}
          {...passwordValues}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isDeleteDisabled} onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginCredentials;
