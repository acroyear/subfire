import { sizeHeight } from "@mui/system";
import { HtmlMedia, PlayerState, SubsonicTypes } from "@subfire/core";
import { useHtmlMedia, useSubsonicQueue } from "@subfire/hooks";
import { ReactEventHandler, Ref, useRef } from "react";
import { usePlayerArtworkControls, PlayerArtworkControls } from "./usePlayerArtworkControls";
import { PlayerQueueControls, usePlayerQueueControls } from "./usePlayerQueueControls";
import { usePlayerStateControls, PlayerStateControls } from "./usePlayerStateControls";
import { usePlayerTimeControls, PlayerTimeControls } from "./usePlayerTimeControls";

export type PlayerControls = PlayerArtworkControls & PlayerQueueControls & PlayerStateControls & PlayerTimeControls & {
    queue: Array<SubsonicTypes.Song>;
    idx: number;
    current: SubsonicTypes.Song;
    queueName: string;
    rule: SubsonicTypes.BookmarkQueueRule;
    player: HtmlMedia;
    state: PlayerState;
};
export interface PlayerContents {
    stopMusicOnUnmount?: boolean,
    disposeOnUnmount?: boolean
    artworkSize?: number
    artworkRef?: Ref<HTMLImageElement>
    onArtworkLoad?: ReactEventHandler<HTMLImageElement>
}
export const usePlayerControls = (props: PlayerContents): PlayerControls => {
    const { stopMusicOnUnmount = false, disposeOnUnmount = false } = props;

    const {
        queue = [],
        idx = 0,
        current,
        currentTime,
        next,
        prev,
        skipAlbum,
        shuffle,
        queueName,
        rule,
        persistCurrentPlayingTime
    } = useSubsonicQueue();
    const timeRef = useRef<number>();
    const {
        time, timePretty, duration, durationPretty, progress, volumeLevel, muted, paused, state, player
    } = useHtmlMedia(stopMusicOnUnmount, disposeOnUnmount);
    timeRef.current = time;

    const { artworkSize, artworkRef, onArtworkLoad } = props;
    const controls1 = usePlayerArtworkControls({
        id: current?.id,
        size: artworkSize, ref: artworkRef, onLoad: onArtworkLoad
    });

    const controls2 = usePlayerStateControls({
        player, volumeLevel, paused, state
    });

    const controls3 = usePlayerQueueControls({
        time: timeRef,
        next,
        prev,
        skipAlbum,
        shuffle,
        queue,
        idx,
        current,
        player
    });

    const controls4 = usePlayerTimeControls({
        time,
        timePretty,
        duration,
        durationPretty,
        player
    });

    const rest = {
        queue,
        idx,
        current,
        state,
        player,
        queueName,
        rule
    }

    return {
        ...controls1,
        ...controls2,
        ...controls3,
        ...controls4,
        ...rest
    };
};
