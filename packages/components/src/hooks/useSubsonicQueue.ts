import { useState, useEffect } from 'react';
import {
    SubsonicQueue,
    SubsonicQueueTypes,
    SubsonicTypes
} from "@subfire/core";
console.log(SubsonicQueue);

type Song = SubsonicTypes.Song;

export const useSubsonicQueue = () => {
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
        set: SubsonicQueue.set
    }
}

export default useSubsonicQueue;