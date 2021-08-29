import { useEffect } from 'react';
import { useSubsonic } from './SubsonicContext';
import { createGlobalState, useInterval } from 'react-use';
import { SubsonicTypes } from '@subfire/core';

export const usePlaylists = createGlobalState<SubsonicTypes.CategorizedPlaylists>();

export const usePlaylistsScanner = (delay: number = 3000) => {
    const { isLoggedIn, Subsonic } = useSubsonic();
    const [pl, setPlaylists] = usePlaylists();
    const loadPlaylists = async () => {
        const p = await Subsonic.getPlaylists();
        const cp = Subsonic.categorizePlaylists(p);
        setPlaylists(cp);
        return cp;
    };

    useInterval(() => {
        loadPlaylists().then((cp) => { console.log(cp);});
    }, isLoggedIn ? delay : null);

    useEffect(() => {
      if (isLoggedIn && !delay) {
        loadPlaylists().then((cp) => { console.log(cp); });
      }
    }, [isLoggedIn, delay]);

    return pl;
};
