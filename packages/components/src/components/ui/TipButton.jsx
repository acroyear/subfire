import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

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
      <IconButton {...props}/>
    </Tooltip>
  );
}

export default TipButton;
