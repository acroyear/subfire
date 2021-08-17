import React from 'react';
import PropTypes from 'prop-types';

import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';

import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

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

  return (
    <>
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
      <IconButton onClick={handleClick} {...buttonProps}>
        <VolumeIcon />
      </IconButton>
    </>
  );
}

VolumeButton.propTypes = {
  volume: PropTypes.number,
  setVolume: PropTypes.func,
  placement: PropTypes.string
};

export default VolumeButton;
