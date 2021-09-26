import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

import useConfirmDialog from './useConfirmDialog';

interface BaseConfirmDialogPropTypes {
  title: string
  open: boolean
  setOpen: (o:boolean) => void
  onConfirm: () => void,
  onCancel: () => void
  confirmText: string
  cancelText: string
  applyTimeout: number
};

// from https://medium.com/javascript-in-plain-english/creating-a-confirm-dialog-in-react-and-material-ui-3d7aaea1d799
const BaseConfirmDialog: React.FC<BaseConfirmDialogPropTypes> = props => {
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
          }}>
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

export const ConfirmDialog = () => {
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

  return confirmOpen ? <BaseConfirmDialog {...hookProps} /> : <span />;
};

export default ConfirmDialog;
