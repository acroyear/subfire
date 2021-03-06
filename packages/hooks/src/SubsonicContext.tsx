import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

import { Subsonic, SubsonicCache } from '@subfire/core';
import { LoginStates } from './SubfireTypes';
import { useCredentials, SubfireCredentials } from './CredentialsContext';
import { LoadingCardPropsType } from '.';

interface SubsonicContextInit {
  children: React.ReactNode
  clientName?: string
  embeddedCredentials?: SubfireCredentials
  LoadingCardComponent: React.FunctionComponent<LoadingCardPropsType> | React.ComponentClass<LoadingCardPropsType>
}

export interface SubsonicContextContent {
  Subsonic: typeof Subsonic,
  SubsonicCache: typeof SubsonicCache,
  loginState: LoginStates,
  isLoggedIn: boolean,
  musicFolderLoaded: boolean,
  musicFolderId: number,
  tryAgain: () => void,
  setMusicFolderId: (id: number) => void,
  getObject: typeof Subsonic.getObject
  LoadingCardComponent: React.FunctionComponent<LoadingCardPropsType> | React.ComponentClass<LoadingCardPropsType>
}

export function buildProcessEnvCredentials(): SubfireCredentials {
  const credentials: SubfireCredentials = {
    server: process.env.sf_server,
    username: process.env.sf_username,
    password: process.env.sf_password,
    bitrate: process.env.sf_bitrate,
    name: "SubFire4Storybook"
  };
  return credentials;
}

export const SubsonicContext = createContext<SubsonicContextContent>(null);
export const SubsonicProvider: React.FC<SubsonicContextInit> = ({ children, clientName, embeddedCredentials, LoadingCardComponent }) => {
  const value = useCredentials() || [];
  // console.warn(value);
  // console.warn(embeddedCredentials);
  const [current] = embeddedCredentials ? [embeddedCredentials] : value;
  // console.warn(current);

  // storing the folder - eventually i want to move this to a subfire prefix
  const [musicFolderId, setMusicFolderId] = useLocalStorage<number>('initMusicFolder', -1);

  // establishing that the user is logged in and the actual folder's limited data is loaded.
  const [loginState, setLoginState] = useState(LoginStates.notLoggedIn);
  const isLoggedIn = loginState === LoginStates.fullyLoggedIn;
  const [musicFolderLoaded, setMusicFolderLoaded] = useState(false);

  const tryAgain = () => {
    setLoginState(LoginStates.notLoggedIn);
    const s = Subsonic;
    const { server, username, password, bitrate } = current;
    s.open(server, username, password, bitrate, clientName || 'UnknownSubFireClient')
      .then(res => {
        setLoginState(LoginStates.partiallyLoggedIn);
      })
      .then(s.getMusicFolders)
      .then(res => -1)
      .then(s.getIndexes)
      .then(res => -1)
      .then(s.getArtists)
      .then(res => { })
      .then(s.getGenres)
      .then(() => {
        // console.log('done');
        setLoginState(LoginStates.fullyLoggedIn);
      })
      .catch(rej => {
        console.log(rej);
      });
  };

  const loadFolderIds = () => {
    if (!isLoggedIn) return;
    async function doLoadFolderIds() {
      setMusicFolderLoaded(false);
      await Subsonic.getIndexes(musicFolderId);
      await Subsonic.getArtists(musicFolderId);
      setMusicFolderLoaded(true);
    }
    doLoadFolderIds();
  };

  useEffect(tryAgain, [current, clientName]);
  useEffect(loadFolderIds, [loginState, musicFolderId]);

  const getObject = Subsonic.getObject;

  const properties = {
    Subsonic,
    SubsonicCache,
    loginState,
    isLoggedIn,
    musicFolderLoaded,
    musicFolderId,
    tryAgain,
    setMusicFolderId,
    getObject,
    LoadingCardComponent
  };

  return <SubsonicContext.Provider value={properties}>{children}</SubsonicContext.Provider>;
};

export const useSubsonic = () => useContext(SubsonicContext);
