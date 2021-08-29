import { useEffect } from 'react';
import { useSubsonic } from './SubsonicContext';
import { createGlobalState, useInterval } from 'react-use';
import { SubsonicTypes } from '@subfire/core';

export const usePlaylists = createGlobalState<SubsonicTypes.CategorizedPlaylists>();
export const usePlaylistScannerDelay = createGlobalState<number>();

export const usePlaylistsScanner = (): [SubsonicTypes.CategorizedPlaylists, number, (i: number) => void] => {
  const { isLoggedIn, Subsonic } = useSubsonic();
  const [pl, setPlaylists] = usePlaylists();
  const [delay, setDelay] = usePlaylistScannerDelay();

  const loadPlaylists = async () => {
    const p = await Subsonic.getPlaylists();
    const cp = Subsonic.categorizePlaylists(p);
    setPlaylists(cp);
    return cp;
  };

  useInterval(() => {
    loadPlaylists().then((cp) => { console.log(cp); });
  }, isLoggedIn ? delay : null);

  useEffect(() => {
    if (isLoggedIn && !delay) {
      loadPlaylists().then((cp) => { console.log(cp); });
    }
  }, [isLoggedIn, delay]);

  return [pl, delay, setDelay];
};
