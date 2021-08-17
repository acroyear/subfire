import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import useConfirmDialog from './useConfirmDialog';

// from https://medium.com/javascript-in-plain-english/creating-a-confirm-dialog-in-react-and-material-ui-3d7aaea1d799
const ConfirmDialog = props => {
  const {
    title,
    open = false,
    setOpen,
    onConfirm = () => {},
    onCancel = () => {},
    confirmText = 'Yes',
    cancelText = 'No',
    applyTimeout = null
  } = props; // eslint-disable-line
  let { children } = props; // eslint-disable-line

  const [timeout, setTimeout] = useState(applyTimeout);

  useEffect(() => {
    if (timeout === null && applyTimeout) {
      setTimeout(applyTimeout);
    }
    const interval = setInterval(() => {
      if (timeout) setTimeout(timeout - 1);
    }, 1000);
    if (!open || applyTimeout === null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeout, applyTimeout, open]); // eslint-disable-line

  useEffect(() => {
    if (timeout === 0) {
      onConfirm();
      setOpen(false);
    }
  }, [timeout]); // eslint-disable-line

  if (typeof children === 'string') {
    children = <Typography variant="body1">{children}</Typography>;
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onCancel();
          }}
          color="default"
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          color="primary"
        >
          {timeout ? `${confirmText} (${timeout})` : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  applyTimeout: PropTypes.number
}

export const ManagedConfirmDialog = props => {
  const {
    confirmTitle,
    confirmContent,
    confirmOpen,
    setConfirmOpen,
    applyConfirm,
    applyCancel,
    button1Label,
    button2Label,
    autoApplyTimeout
  } = useConfirmDialog();

  const hookProps = {
    title: confirmTitle,
    children: confirmContent,
    open: confirmOpen,
    setOpen: setConfirmOpen,
    onConfirm: applyConfirm,
    onCancel: applyCancel,
    confirmText: button1Label,
    cancelText: button2Label,
    applyTimeout: autoApplyTimeout
  };

  return confirmOpen ? <ConfirmDialog {...hookProps} /> : <span />;
};
