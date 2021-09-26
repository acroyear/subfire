import React, { useState } from 'react';
import PropTypes from 'prop-types';

import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// import { makeStyles } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

import { Gc, Gi } from '../TGB';

export function VolumeControl(props) {
  const { volume = 1, setVolume } = props;
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(volume);

  const muteClick = () => {
    if (volume === 0) {
      setVolume(volumeBeforeMute);
    } else {
      setVolumeBeforeMute(volume);
      setVolume(0);
    }
  };

  const maxClick = () => {
    setVolume(Math.min(volume + 0.1, 1));
  };

  return (
    <Gc spacing={2}>
      <Gi>{volume === 0 ? <VolumeOffIcon onClick={muteClick} /> : <VolumeDownIcon onClick={muteClick} />}</Gi>
      <Gi xs>
        <Slider
          min={0}
          max={40}
          step={1}
          value={volume * 40}
          onChange={(event, newValue) => setVolume(newValue / 40)}
        />
      </Gi>
      <Gi>
        <VolumeUpIcon onClick={maxClick} />
      </Gi>
    </Gc>
  );
}

VolumeControl.propTypes = {
  volume: PropTypes.number,
  setVolume: PropTypes.func
};

export default VolumeControl;
