import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import KeyboardBackspace from '@material-ui/icons/KeyboardBackspace';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import AuthExchangeActions from './AuthExchangeActions';

import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
  centerHeader: {
    textAlign: 'center',
    fontSize: '40pt',
    letterSpacing: '.5ch',
    color: 'white'
  },
  gridItem: {
    justifyContent: 'center',
    textAlign: 'center'
  },
  fab: {
    fontSize: '20pt'
  },
  button: {
    fontSize: '16pt'
  },
  textInput: {
    fontSize: '20pt'
  },
  textField: {
    paddingTop: '2em'
  }
});

const AuthCodeSource = props => {
  const inputRef = useRef(null);

  const submit = () => {
    AuthExchangeActions.sourceSubmit(inputRef.current.value)
      .then(function (response, err) {
        if (response) console.log(response.ok);
        if (err) console.error(err);

        if (response.ok) return response.json();
        return response.json();
      })
      .then(function (j) {
        if (props.handleClose) props.handleClose();
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  const handleButtonClick = e => {
    let value = e.target.dataset.value;
    if (value === undefined) value = e.target.parentElement.dataset.value;

    if (value === 'DEL') {
      let s = inputRef.current.value;
      s = s.substring(0, s.length - 1);
      inputRef.current.value = s;
    } else if (value) {
      inputRef.current.value = inputRef.current.value + value;
    }
  };

  const { classes } = props;
  return (
    <Dialog disableBackdropClick open={true} className={classes.paperFullScreen}>
      <DialogTitle>{'Authenticate Via Existing Source'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{"Enter the specified digits from the other device's screen."}</DialogContentText>
        <Grid container spacing={4} justify="center" alignItems="center">
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} autoFocus onClick={handleButtonClick} data-value="1">
              1
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="2">
              2
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="3">
              3
            </Fab>
          </Grid>

          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="4">
              4
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="5">
              5
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="6">
              6
            </Fab>
          </Grid>

          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="7">
              7
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="8">
              8
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="9">
              9
            </Fab>
          </Grid>

          <Grid item className={classes.gridItem} xs={4}>
            &nbsp;
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="primary" className={classes.fab} onClick={handleButtonClick} data-value="0">
              0
            </Fab>
          </Grid>
          <Grid item className={classes.gridItem} xs={4}>
            <Fab color="secondary" className={classes.fab} onClick={handleButtonClick} data-value="DEL">
              <KeyboardBackspace data-value="DEL" />
            </Fab>
          </Grid>
        </Grid>
        <TextField className={classes.textField} InputProps={{ className: classes.textInput }} fullWidth inputRef={inputRef} />
      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={props.handleClose}>
          Cancel
        </Button>
        <Button className={classes.button} onClick={submit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AuthCodeSource.propTypes = {
  classes: PropTypes.any,
  handleClose: PropTypes.func
};

export default withStyles(styles)(AuthCodeSource);