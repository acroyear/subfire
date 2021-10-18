import React from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';

import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

import VolumeControl from './VolumeControl';

export function VolumeButton(props) {
  const { volume, setVolume, placement = 'above', ...buttonProps } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const VolumeIcon = volume === 0 ? VolumeOffIcon : volume < 0.35 ? VolumeDownIcon : VolumeUpIcon;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const belowButton = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    },
    transformOrigin: {
      vertical: 'center',
      horizontal: 'left'
    }
  };

  const aboveButton = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left'
    },
    transformOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    }
  }

  const placementOrigins = placement === 'above' ? aboveButton : belowButton;

  return <>
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      {...placementOrigins}
    >
      <div style={{ width: 250, height: 'auto', padding: '12px 16px 12px 16px' }}>
        <VolumeControl volume={volume} setVolume={setVolume} />
      </div>
    </Popover>
    <IconButton onClick={handleClick} {...buttonProps} size="large">
      <VolumeIcon />
    </IconButton>
  </>;
}

VolumeButton.propTypes = {
  volume: PropTypes.number,
  setVolume: PropTypes.func,
  placement: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string
};

export default VolumeButton;
