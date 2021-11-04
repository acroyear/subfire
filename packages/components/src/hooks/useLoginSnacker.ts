import { useRef, useEffect, RefObject } from 'react';

import { LoginStates } from '../SubfireTypes';
import { useSubsonic } from './SubsonicContext';
import { SnackbarKey, useSnackbar } from 'notistack';
import { UseTimeoutFnReturn } from 'react-use/lib/useTimeoutFn';

export function useLoginSnacker() {
  const { loginState } = useSubsonic();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackRef = useRef<SnackbarKey>();

  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (snackRef.current) {
      closeSnackbar(snackRef.current);
      snackRef.current = null;
    }
    if (loginState === LoginStates.notLoggedIn) {
      snackRef.current = enqueueSnackbar('Logged Out', {
        variant: 'error'
      });
    }
    if (loginState === LoginStates.partiallyLoggedIn) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        snackRef.current = enqueueSnackbar('Login Partialy Successful', {
          variant: 'warning'
        });
      }, 5000);
    } else if (loginState === LoginStates.fullyLoggedIn) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      snackRef.current = enqueueSnackbar('Login Successful', {
        variant: 'success'
      });
    }
  }, [enqueueSnackbar, closeSnackbar, loginState]);
}

export default useLoginSnacker;
