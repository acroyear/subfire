import React, { useState } from "react";

import {VolumeButton, VolumeControl} from "../../..";
import { action } from "@storybook/addon-actions";

export default {
  title: "ui/volume",
};

export const VolumeDemo1 = (p) => {
  const [volume, _setVolume] = useState(1);
  const setVolume = (volumeSet) => {
    console.log("volume", volumeSet);
    action(JSON.stringify({ volume: volumeSet }));
    _setVolume(volumeSet);
  };
  return (
    <div style={{ width: 250 }}>
      <VolumeControl volume={volume} setVolume={setVolume} />
    </div>
  );
};

export const VolumeDemo2 = (p) => {
  const [volume, _setVolume] = useState(1);
  const setVolume = (volumeSet) => {
    console.log("volume", volumeSet);
    action(JSON.stringify({ volume: volumeSet }));
    _setVolume(volumeSet);
  };
  return (
    <>
      <div style={{ height: 150 }} />
      <div>
        <VolumeButton volume={volume} setVolume={setVolume} placement="above" />
        <VolumeButton volume={volume} setVolume={setVolume} placement="below" />
      </div>
    </>
  );
};
