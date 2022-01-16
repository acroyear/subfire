import { HtmlMedia, SubsonicTypes } from "@subfire/core";
import { useState } from "react";
import Slider from '@mui/material/Slider';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward30Icon from '@mui/icons-material/Forward30';
import IconButton from '@mui/material/IconButton';

export interface PlayerTimeControls {
    back10Button: JSX.Element
    skip30Button: JSX.Element
    currentTime: string
    duration: string
    slider: JSX.Element
}

export interface PlayerTimeContents {
    time: number
    timePretty: string
    duration: number
    durationPretty: string
    player: HtmlMedia
    buttonClassNames?: string
    sliderClassNames?: string
}

export const usePlayerTimeControls = (psc: PlayerTimeContents): PlayerTimeControls => {
    const { time, timePretty, duration, durationPretty, player, sliderClassNames, buttonClassNames } = psc;
    const [draggingTime, setDraggingTime] = useState(0);

    const sliderSeekTo = (_evt: any, value: number | number[]) => {
        setDraggingTime(value as number);
    };

    const sliderLockTo = (_evt: any, value: number | number[]) => {
        setDraggingTime(0);
        player.seek(value as number);
    };

    const seekbackward = () => player.seek(time - 10);
    const seekforward = () => player.seek(time + 30);

    const controls: PlayerTimeControls = {
        currentTime: timePretty || '--:--',
        duration: durationPretty || '--:--',
        slider: (
            <Slider
                className={sliderClassNames}
                min={0}
                max={duration || 100}
                value={draggingTime || time || 0}
                onChange={sliderSeekTo}
                onChangeCommitted={sliderLockTo}
                marks={/* marks || */[]}
            />
        ),
        back10Button: (
            <IconButton
                title="Back 10 seconds"
                className={buttonClassNames}
                onClick={seekbackward}
                size="large">
                <Replay10Icon />
            </IconButton>
        ),
        skip30Button: (
            <IconButton
                title="Skip 30 seconds"
                className={buttonClassNames}
                onClick={seekforward}
                size="large">
                <Forward30Icon />
            </IconButton>
        )
    }

    return controls;
}