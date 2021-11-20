import { useState, useEffect } from 'react';
import {
    SubsonicQueue,
    SubsonicQueueTypes,
    SubsonicTypes,
    persistCurrentPlayingTime
} from "@subfire/core";

console.log(SubsonicQueue);

type Song = SubsonicTypes.Song;

export interface SubsonicQueueHook extends SubsonicQueueTypes.QueueModel<Song> {
    next: () => void
    prev: () => void
    skipAlbum: () => void
    skipTo: (i: number) => void
    shuffle: (b?: boolean) => void
    set: (s: SubsonicTypes.SongList, idx?: number, time?: number, name?: string, rule?: SubsonicTypes.BookmarkQueueRule) => void,
    persistCurrentPlayingTime(currentTime: number): void
}

export const useSubsonicQueue = (): SubsonicQueueHook => {
    const [state, setState] = useState<SubsonicQueueTypes.QueueModel<Song>>(SubsonicQueue.getState());
    useEffect(() => {
        console.log('init');
        const all1 =  (evt: SubsonicQueueTypes.SubsonicQueueEvent<Song>) => {
            console.log('change event');
            setState(() => evt.data);
        }
        SubsonicQueue.addEventListener('change', all1);
        return () => {
            console.log('cleanup');
            SubsonicQueue.removeEventListener('change', all1);
        }
    }, []);

    return {
        ...state,
        next: SubsonicQueue.next,
        prev: SubsonicQueue.prev,
        skipAlbum: SubsonicQueue.skipAlbum,
        skipTo: SubsonicQueue.skipTo,
        shuffle: SubsonicQueue.shuffle,
        set: SubsonicQueue.set,
        persistCurrentPlayingTime
    }
}

export default useSubsonicQueue;
