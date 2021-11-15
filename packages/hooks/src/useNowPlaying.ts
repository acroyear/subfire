import { useEffect } from 'react';

import { SubsonicTypes } from '@subfire/core';
import { useSubsonic } from './SubsonicContext';
import { createGlobalState, useInterval } from 'react-use';

export const useNowPlayingState = createGlobalState<SubsonicTypes.NowPlayingEntries>([]);
export const useNowPlayingScanner = createGlobalState<number>(5000);

export const useNowPlaying = (): [SubsonicTypes.NowPlayingEntries, number, (i: number) => void] => {
    const { isLoggedIn, Subsonic } = useSubsonic();
    const [np, setNowPlaying] = useNowPlayingState();
    const [delay, setDelay] = useNowPlayingScanner();

    const loadNowPlaying = async () => {
        const nps = await Subsonic.getNowPlaying();
        setNowPlaying(nps.entry || []);
        return nps;
    };

    useInterval(() => {
        loadNowPlaying().then((cp) => { console.debug(cp); });
    }, isLoggedIn && delay ? delay : null);

    useEffect(() => {
        // console.warn(isLoggedIn, !delay, delay);
        if (isLoggedIn) {
            loadNowPlaying().then((cp) => { console.debug(cp); });
        }
    }, [isLoggedIn]);

    return [np, delay, setDelay];
};

export default useNowPlaying;
