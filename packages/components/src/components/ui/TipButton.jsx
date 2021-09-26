import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

export const TipButton = p => {
  const { title, placement, ...props} = p;
  return (
    <Tooltip title={title || ''} placement={placement || 'bottom'}>
      <Button {...props}/>
    </Tooltip>
  );
}

export const TipIconButton = p => {
  const { title, placement, ...props} = p;
  return (
    <Tooltip title={title || ''} placement={placement || 'bottom'}>
      <IconButton {...props} size="large" />
    </Tooltip>
  );
}

export default TipButton;
