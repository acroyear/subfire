import { useHtmlMedia } from "./useHtmlMedia";
import { useMediaSession } from "./useMediaSession";
import { useSubsonicQueue } from "./useSubsonicQueue";
import { useSubsonic } from "./SubsonicContext";
import { useEffect } from "react";

export interface IntegratedPlayerQueuePlayerProps {
    stopMusicOnUnmount?: boolean,
    disposeOnUnmount?: boolean
}

export const IntegratedPlayerQueue: React.FC<IntegratedPlayerQueuePlayerProps> = ({stopMusicOnUnmount = false, disposeOnUnmount = false}) => {
    const { Subsonic} = useSubsonic();

    const {
        time, player
    } = useHtmlMedia(stopMusicOnUnmount, disposeOnUnmount);

    const {
        queue = [],
        current,
        currentTime,
        next,
        prev,
        persistCurrentPlayingTime
    } = useSubsonicQueue();

    const beginingOrPrevSong = () => {
        if (time < 10 && queue.length > 1) {
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

    const mediaSessionControls = {
        play: () => player?.play(),
        pause: () => player?.pause(),
        nexttrack: nextOrResetSong,
        previoustrack: beginingOrPrevSong,
        seekbackward: () => player.seek(time - 10),
        seekforward: () => player.seek(time + 30),
        seekto: (details: any) => player.seek(details.seekTime)
    };

    const coverArtUrl = Subsonic.connected ? Subsonic.getCoverArtURL(current.coverArt, 192) : null;

    useMediaSession({
        element: player?.e,
        mediaMetadata: current ? {
            ...current, artwork: [{
                src: coverArtUrl,
                sizes: '192x192', type: 'image/jpeg'
            }]
        } : null,
        controls: mediaSessionControls
    });

    useEffect(() => {
        if (!player || !current) return;
        if (player.src === current.src) return;
        player.load(current.src, currentTime || 0);
    }, [player, current, currentTime]);

    useEffect(() => {
        if (!player) return;
        player.on('end', () => {
            if (queue.length === 1) {
                player.seek(0);
                player.play();
                return;
            }
            next();            
        });
        // return () => { if (player) player.off()}
    }, [player]);

    useEffect(() => persistCurrentPlayingTime(time), [time]);

    return (<></>);
}
