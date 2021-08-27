import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import AuthExchangeActions from './AuthExchangeActions';
import { useCredentials } from "../../hooks/CredentialsContext";
import { Tea } from "@subfire/core";

import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
  centerHeader: {
    textAlign: 'center',
    fontSize: '40pt',
    letterSpacing: '.5ch'
  }
});

const AuthCodeClient = props => {
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
    <Dialog disableBackdropClick open={true} className={classes.paperFullScreen}>
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

AuthCodeClient.propTypes = {
  classes: PropTypes.any,
  handleClose: PropTypes.func
};

export default withStyles(styles)(AuthCodeClient);
