import { PortraitPlayer, ThePlayer, ThePlayerComponents } from "@subfire/components";
import { SubsonicTypes } from "@subfire/core";

const ThePlayerBasic = (components: ThePlayerComponents, current: SubsonicTypes.Song, queue: SubsonicTypes.SongList): JSX.Element => {
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

export const Player1 = (_p: any) => {
    return <ThePlayer render={PortraitPlayer}></ThePlayer>
}