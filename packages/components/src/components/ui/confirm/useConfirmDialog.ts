import { useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

function useConfirmDialogImpl() {
  const [confirmTitle, setConfirmTitle] = useState('Confirm');
  const [confirmContent, setConfirmContent] = useState('Are you sure?');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applyConfirm, setApplyConfirm] = useState(() => () => { }); // default no-op
  const [applyCancel, setApplyCancel] = useState(() => () => { }); // default no-op
  const [button1Label, setButton1Label] = useState('Yes');
  const [button2Label, setButton2Label] = useState('Yes');
  const [autoApplyTimeout, setAutoApplyTimeout] = useState<number>(null);
  // passing in a funtion to return a function is from
  // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  const confirmUserAction = (
    title: string,
    content: string,
    action: string,
    cancelAction: string,
    button1Label = 'Yes',
    button2Label = 'No',
    autoApplyTimeout = null as number
  ) => {
    setConfirmTitle(title);
    setConfirmContent(content);
    setApplyConfirm(() => action);
    setApplyCancel(() => cancelAction);
    setButton1Label(button1Label);
    setButton2Label(button2Label);
    setConfirmOpen(true);
    setAutoApplyTimeout(autoApplyTimeout);
  };

  return {
    confirmTitle,
    confirmContent,
    confirmOpen,
    setConfirmOpen,
    applyConfirm,
    applyCancel,
    confirmUserAction,
    button1Label,
    button2Label,
    autoApplyTimeout
  };
}

const useConfirmDialog = singletonHook({} as any, useConfirmDialogImpl);

export default useConfirmDialog;
