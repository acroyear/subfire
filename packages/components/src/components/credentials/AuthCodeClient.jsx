import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import AuthExchangeActions from './AuthExchangeActions';
import { useCredentials } from "../../hooks/CredentialsContext";
import { Tea } from "@subfire/core";

import withStyles from '@mui/styles/withStyles';
const styles = theme => ({
  centerHeader: {
    textAlign: 'center',
    fontSize: '40pt',
    letterSpacing: '.5ch'
  }
});

const AuthCodeClientImpl = props => {
  const [digits] = useState(AuthExchangeActions.allocateDigits());
  const [isActive, setIsActive] = useState(true);
  const value = useCredentials();

  const [original, creds, originalKey, setNewCurrent, updateCreds, deleteCreds, importCreds] = value; // eslint-disable-line

  console.log('digits', digits);
  useEffect(() => {
    AuthExchangeActions.clientRequest(digits)
      .then(function (response, err) {
        if (response) console.log(response.ok);
        if (err) console.error(err);

        if (response.ok) return response.json();
        return response.json();
      })
      .then(function (j) {
        console.log('back', j);
        if (j.status === 200) {
          // if parse failure, let the exception fire
          let data = Tea.decrypt(j.data, digits);
          console.log(data);
          data = JSON.parse(data);
          console.log(data);
          data = JSON.parse(data.configs);
          console.log(data);
          // CredentialsActions.importCredentials(configs);
          console.log('are we active?', isActive);
          if (isActive) {
            importCreds(data);
          }
          if (props.handleClose) props.handleClose();
        }
      })
      .catch(function (err) {
        console.error(err);
        if (props.handleClose) props.handleClose();
      });
    return () => {
      // unmounting
      setIsActive(false);
    };
  }, []); // eslint-disable-line

  const { classes, handleClose } = props;

  return (
    <Dialog open={true} className={classes.paperFullScreen}>
      <DialogTitle>{'Authenticate Via Existing Source'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          On another device where you are already authenticated, enter the following {(digits + '').length} digits.
        </DialogContentText>
        <Typography variant="h1" className={classes.centerHeader}>
          {digits}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

AuthCodeClientImpl.propTypes = {
  classes: PropTypes.any,
  handleClose: PropTypes.func
};

export const AuthCodeClient = withStyles(styles)(AuthCodeClientImpl);
export default AuthCodeClient;
