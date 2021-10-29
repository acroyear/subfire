import React, { ReactEventHandler, Ref, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FAB from '@mui/material/Fab';

import QueueIcon from '@mui/icons-material/Queue';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward30Icon from '@mui/icons-material/Forward30';
import { DebugStepOver } from '@mitch528/mdi-material-ui';
import Slider from '@mui/material/Slider';
import makeStyles from '@mui/styles/makeStyles';
// import CastButton from 'subfirelib/controls/cast/CastButton';

import { useKey } from 'react-use';
import { Tb2 } from '../ui/TGB';
import { VolumeButton } from '../ui/volume/VolumeButton';
import useSubsonicQueue from '../../hooks/useSubsonicQueue';
import { useSubsonic } from '../../hooks/SubsonicContext';
import { useBookmarksService } from '../../hooks/useBookmarkService';
import { useHtmlMedia } from '../../hooks/useHtmlMedia';
import { useMediaSession } from '../../hooks/useMediaSession';
import { PlayerState, SubsonicTypes } from '@subfire/core';

type Bookmark = SubsonicTypes.Bookmark;

const BookmarkButton = (p: any) => {
    const { onClick, bookmarkIcon, id, bookmarkForId, ...rest } = p;
    return (
        <IconButton
            {...rest}
            onClick={evt => onClick(evt, id, bookmarkForId(id))}
            size="large">
            {bookmarkIcon(p.id)}
        </IconButton>
    );
};

const useStyles = makeStyles(theme => ({
    paper: {
        // backgroundColor: theme.palette.secondary.main,
        transition: 'background 2s ease-in-out',
        // color: theme.palette.secondary.contrastText,
        paddingTop: 5,
        paddingBottom: 5
    },
    paperDark: {
        // backgroundColor: theme.palette.secondary.dark,
        transition: 'background 2s ease-in-out',
        // color: theme.palette.secondary.contrastText,
        paddingTop: 5,
        paddingBottom: 5
    },
    grid: {
        // backgroundColor: theme.palette.secondary.main,
        transition: 'background 2s ease-in-out',
        // color: theme.palette.secondary.contrastText,
        paddingTop: 5,
        paddingBottom: 5
    },
    pad: {
        paddingLeft: 5,
        paddingRight: 5
    },
    button: {
        // color: 'inherit', // theme.palette.secondary.contrastText,
        // minWidth: 36
    },
    sliderwrap: { paddingLeft: 5, paddingRight: 5 },
    slider: {
        width: 'calc(100% - 5px)',
        // color: theme.palette.primary.main
    }
}));

export interface ThePlayerArtwork {
    (size: number, ref?: Ref<HTMLImageElement>, handler?: ReactEventHandler<HTMLImageElement>, className?: string): JSX.Element
}

export interface ThePlayerComponents {
    back10Button: JSX.Element
    skip30Button: JSX.Element
    currentTime: string
    duration: string
    slider: JSX.Element
    prevButton: JSX.Element
    playPauseButton: JSX.Element
    nextButton: JSX.Element
    skipAlbumButton: JSX.Element
    bookmarkButton: JSX.Element
    shuffleQueueButton: JSX.Element
    playQueueButton: JSX.Element
    volumeButtonAbove: JSX.Element
    volumeButtonBelow: JSX.Element
    artwork: ThePlayerArtwork
    queuePosition: string
    state: PlayerState
}

export interface ThePlayerProps {
    render: (components: ThePlayerComponents, current: SubsonicTypes.Song, queue: SubsonicTypes.SongList) => JSX.Element
}

export const ThePlayer = (props: any) => {
    const {
        time, timePretty, duration, durationPretty, progress, volumeLevel, muted, paused, state, player
    } = useHtmlMedia(true, true);

    const setVolumeLevel = (v: number) => {
        player.volume(v);
    }

    const {
        queue = [],
        idx = 0,
        current,
        next,
        prev,
        skipAlbum,
        shuffle,
        queueName,
        rule
    } = useSubsonicQueue();

    const classes = useStyles();

    const { isLoggedIn, Subsonic } = useSubsonic();

    const { deleteBookmark, createSubfireBookmark, bookmarkForId, bookmarkIcon, savePlayQueue } = useBookmarksService(true);

    const [draggingTime, setDraggingTime] = useState(0);

    useEffect(() => {
        if (!player || !current) return;
        player.load(current.src);
    }, [player, current]);

    useEffect(() => {
        if (!player) return;
        player.on('end', next);
        // return () => { if (player) player.off()}
    }, [player]);

    const onPlayPauseClick = paused ? player?.play : player?.pause;
    const playPauseContent = paused ? <PlayArrowIcon /> : <PauseIcon />;

    const sliderSeekTo = (_evt: any, value: number | number[]) => {
        setDraggingTime(value as number);
    };

    const sliderLockTo = (_evt: any, value: number | number[]) => {
        setDraggingTime(0);
        player.seek(value as number);
    };

    const beginingOrPrevSong = () => {
        if (time < 10) {
            prev();
        } else {
            player.seek(0);
        }
    }

    const mediaSessionControls = {
        play: player?.play,
        pause: player?.pause,
        nexttrack: next,
        previoustrack: beginingOrPrevSong,
        seekbackward: () => player.seek(time - 10),
        seekforward: () => player.seek(time + 30),
        seekto: (details: any) => player.seek(details.seekTime)
    };

    useMediaSession({
        element: player?.e,
        mediaMetadata: current ? {
            ...current, artwork: [{
                src: Subsonic.getCoverArtURL(current.coverArt, 192),
                sizes: '192x192', type: 'image/jpeg'
            }]
        } : null,
        controls: mediaSessionControls
    });

    const bookmarkClick = (_evt: any, id: string, bookmark: Bookmark) => {
        console.log(id, bookmark);
        if (bookmark) {
            deleteBookmark(id);
        } else {
            console.log('context', queue);
            // need json context here
            createSubfireBookmark(id, Math.trunc(time * 1000), rule);
        }
    };

    const doSavePlayQueue = () => {
        savePlayQueue(queue || [], current?.id, Math.trunc(time * 1000));
    };

    const components: ThePlayerComponents = {
        back10Button: (
            <IconButton
                title="Back 10 seconds"
                className={classes.button}
                onClick={mediaSessionControls.seekbackward}
                size="large">
                <Replay10Icon />
            </IconButton>
        ),
        skip30Button: (
            <IconButton
                title="Skip 30 seconds"
                className={classes.button}
                onClick={mediaSessionControls.seekforward}
                size="large">
                <Forward30Icon />
            </IconButton>
        ),
        currentTime: timePretty || '--:--',
        duration: durationPretty || '--:--',
        slider: (
            <Slider
                className={classes.slider}
                min={0}
                max={duration || 100}
                value={draggingTime || time || 0}
                onChange={sliderSeekTo}
                onChangeCommitted={sliderLockTo}
                marks={/* marks || */[]}
            />
        ),
        prevButton: (
            <IconButton
                title="Prev"
                className={classes.button}
                onClick={mediaSessionControls.previoustrack}
                size="large">
                <SkipPreviousIcon />
            </IconButton>
        ),
        playPauseButton: (
            <FAB title="Play/Pause" color="primary" size="small" onClick={onPlayPauseClick}>
                {playPauseContent}
            </FAB>
        ),
        nextButton: (
            <IconButton
                title="Next"
                className={classes.button}
                onClick={mediaSessionControls.nexttrack}
                size="large">
                <SkipNextIcon />
            </IconButton>
        ),
        skipAlbumButton: (
            <IconButton
                title="Skip Album"
                className={classes.button}
                onClick={skipAlbum}
                size="large">
                <DebugStepOver />
            </IconButton>
        ),
        bookmarkButton: (
            <BookmarkButton
                id={current?.id}
                bookmarkForId={bookmarkForId}
                bookmarkIcon={bookmarkIcon}
                title="Bookmark"
                onClick={bookmarkClick}
            />
        ),
        shuffleQueueButton: (
            <IconButton
                title="Save Play Queue"
                className={classes.button}
                onClick={() => shuffle()}
                size="large">
                <ShuffleIcon />
            </IconButton>
        ),
        playQueueButton: (
            <IconButton
                title="Save Play Queue"
                className={classes.button}
                onClick={doSavePlayQueue}
                size="large">
                <QueueIcon />
            </IconButton>
        ),
        volumeButtonAbove: (
            <VolumeButton
                placement="above"
                title="Volume"
                className={classes.button}
                volume={volumeLevel}
                setVolume={v => player.volume(v)}
            />
        ),
        volumeButtonBelow: (
            <VolumeButton
                placement="below"
                title="Volume"
                style={{ color: 'inherit' }}
                className={classes.button}
                volume={volumeLevel}
                setVolume={v => player.volume(v)}
            />
        ),
        artwork: (size: number = 0, ref: Ref<HTMLImageElement>, handler: ReactEventHandler<HTMLImageElement>, className: string) => (
            <img
                className={className}
                crossOrigin="anonymous"
                onLoad={handler}
                ref={ref}
                src={current ? Subsonic.getCoverArtURL(current.coverArt, size) : null}
                style={size ? { width: size, height: 'auto' } : {}}
                alt=""
            />
        ),
        // CastButton,
        queuePosition: `${idx + 1} / ${queue.length}`,
        state
    };

    useKey('p', (p) => {
        const x = document.activeElement.tagName;
        if (x.toUpperCase() === 'INPUT') {
            // console.log('ignoring');
        } else {
            // console.log('pause/play toggle', state.paused);
            onPlayPauseClick();
        }
    }, {}, [onPlayPauseClick]); // dependent on this method

    const render = props.render || (() => <Tb2>no render function</Tb2>);
    return render(components, current, queue);
}

export default ThePlayer;

