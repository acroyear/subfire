import { HtmlMedia, Song } from "@subfire/core";
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { DebugStepOver } from 'mdi-material-ui';
import IconButton from '@mui/material/IconButton';

export interface PlayerQueueControls {
    prevButton: JSX.Element
    nextButton: JSX.Element
    skipAlbumButton: JSX.Element
    shuffleQueueButton: JSX.Element
    queuePosition: string
}

export interface PlayerQueueContents {
    time?: React.RefObject<number>
    next: () => void
    prev: () => void
    skipAlbum: () => void
    shuffle: () => void
    queue: Array<Song>
    idx: number
    current: Song
    player: HtmlMedia
    buttonClassNames?: string
}

export const usePlayerQueueControls = (psc: PlayerQueueContents): PlayerQueueControls => {
    const { current, time, queue, idx, prev, next, shuffle, skipAlbum, player, buttonClassNames } = psc;
    const beginingOrPrevSong = () => {
        if ((time?.current || 11) < 10 && queue.length > 1) {
            prev();
            return;
        }
        player.seek(0);
    }

    const nextOrResetSong = () => {
        if (queue.length === 1) {
            player.seek(0);
            return;
        }
        next();
    }

    const controls: PlayerQueueControls = {
        prevButton: (
            <IconButton
                title="Prev"
                className={buttonClassNames}
                onClick={beginingOrPrevSong}
                size="large">
                <SkipPreviousIcon />
            </IconButton>
        ),
        nextButton: (
            <IconButton
                title="Next"
                className={buttonClassNames}
                onClick={nextOrResetSong}
                size="large">
                <SkipNextIcon />
            </IconButton>
        ),
        skipAlbumButton: (
            <IconButton
                title="Skip Album"
                className={buttonClassNames}
                onClick={skipAlbum}
                size="large">
                <DebugStepOver />
            </IconButton>
        ),
        shuffleQueueButton: (
            <IconButton
                title="Save Play Queue"
                className={buttonClassNames}
                onClick={() => shuffle()}
                size="large">
                <ShuffleIcon />
            </IconButton>
        ),
        queuePosition: `${idx + 1} / ${queue.length}`
    }

    return controls;
}