import { DeprecatedPlayer as ThePlayer, DeprecatedPlayerComponents } from "@subfire/components";
import { SubsonicTypes } from "@subfire/core";
import { PortraitPlayer } from "./legacy/PortraitPlayer";

const ThePlayerBasic = (components: DeprecatedPlayerComponents, current: SubsonicTypes.Song, queue: SubsonicTypes.SongList): JSX.Element => {
    return <>
        <p>The Player?: {current?.name || current?.title}</p>
        {components.playPauseButton}
        {components.prevButton}
        {components.currentTime}
        {components.nextButton}
        {components.duration}
        {components.volumeButtonBelow}
        {components.shuffleQueueButton}
        {components.queuePosition}
        <br />
        {components.slider}
        {current?.src}<br />
        {components.artwork(100)}
    </>
}

console.debug(ThePlayerBasic);

export const Player1 = (_p: any) => {
    return <ThePlayer render={PortraitPlayer}></ThePlayer>
}