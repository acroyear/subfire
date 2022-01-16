import React, { ReactEventHandler, Ref, useEffect, useRef, useState } from 'react';
import { HtmlMedia, PlayerState, Subsonic, SubsonicTypes } from '@subfire/core';
import { VolumeButton } from '../components/ui/volume/VolumeButton';
import FAB, { FabProps } from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export interface PlayerStateControls {
    playPauseButton: JSX.Element
    volumeButtonAbove: JSX.Element
    volumeButtonBelow: JSX.Element
}

export interface PlayerStateContents {
    player: HtmlMedia
    volumeLevel: number
    paused: boolean
    state: PlayerState

    playPauseButtonProps?: FabProps;

    volumeButtonClassName?: string;
}

export const usePlayerStateControls = (psc: PlayerStateContents): PlayerStateControls => {
    const { paused, player, state, volumeLevel, volumeButtonClassName } = psc;
    const playPauseButtonProps = psc.playPauseButtonProps || {
        size: "small",
        color: "primary"
    }
    const onPlayPauseClick = paused ? () => player?.play() : () => player?.pause();
    const playPauseContent = paused ? <PlayArrowIcon /> : <PauseIcon />;

    return {
        playPauseButton: (
            <FAB title="Play/Pause" onClick={onPlayPauseClick} {...playPauseButtonProps}>
                {playPauseContent}
            </FAB>
        ),
        volumeButtonAbove: (
            <VolumeButton
                placement="above"
                title="Volume"
                className={volumeButtonClassName}
                volume={volumeLevel}
                setVolume={v => player.volume(v)}
            />
        ),
        volumeButtonBelow: (
            <VolumeButton
                placement="below"
                title="Volume"
                style={{ color: 'inherit' }}
                className={volumeButtonClassName}
                volume={volumeLevel}
                setVolume={v => player.volume(v)}
            />
        )
    }
}

export default usePlayerStateControls;