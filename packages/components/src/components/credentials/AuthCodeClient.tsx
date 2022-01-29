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
import { useCredentials } from "@subfire/hooks";
import { Tea } from "@subfire/core";

const AuthCodeClientImpl = (props: { handleClose?: React.MouseEventHandler<HTMLButtonElement>, classes?: Record<string, any> }) => {
  const [digits] = useState(AuthExchangeActions.allocateDigits());
  const [isActive, setIsActive] = useState(true);
  const value = useCredentials();

  const [original, creds, originalKey, setNewCurrent, updateCreds, deleteCreds, importCreds] = value; // eslint-disable-line

  const centerHeader =  {
        textAlign: 'center',
        fontSize: '40pt',
        letterSpacing: '.5ch'
      };

      useEffect(() => {
    AuthExchangeActions.clientRequest(digits)
    .then((response: any) => {
      if (response) console.log(response.ok);
      if (response.ok) return response.json();
        return response.json();
      })
      .then(function (j) {
        console.log('back', j);
        if (j.status === 200) {
          // if parse failure, let the exception fire
          let data: any = Tea.decrypt(j.data, digits);
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
          if (props.handleClose) props.handleClose(null);
        }
      })
      .catch(function (err) {
        console.error(err);
        if (props.handleClose) props.handleClose(null);
      });
    return () => {
      // unmounting
      setIsActive(false);
    };
  }, []); // eslint-disable-line

  const { handleClose } = props;

  const classes = {} as any;

  return (
    <Dialog open={true} className={classes.paperFullScreen}>
      <DialogTitle>{'Authenticate Via Existing Source'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          On another device where you are already authenticated, enter the following {(digits + '').length} digits.
        </DialogContentText>
        <Typography variant="h1" sx={centerHeader}>
          {digits}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export const AuthCodeClient = AuthCodeClientImpl;
export default AuthCodeClient;
