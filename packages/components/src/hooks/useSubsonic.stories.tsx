import React, { useEffect } from 'react';
import { useSubsonic, SubsonicProvider, buildProcessEnvCredentials } from './SubsonicContext';

export default {
  title: 'hooks/SubsonicContextAlone'
};

const SubsonicWrapper: React.FC<any> = props => {
  console.warn(props);
  return (
    <SubsonicProvider clientName="SubfireStorybook" embeddedCredentials={props.embeddedCredentials}>
      {props.children}
    </SubsonicProvider>
  );
};

const Inner = (_props: any) => {
  const { loginState, isLoggedIn, musicFolderLoaded, musicFolderId, tryAgain, SubsonicCache: cache, Subsonic } = useSubsonic();

  useEffect(() => {
    if (isLoggedIn) {
      console.log('subsonic', Subsonic);
      console.log('musicFolderLoaded', musicFolderLoaded, musicFolderId);
      console.log('MusicFolders', cache.MusicFolders);
      console.log('MusicDirectoryIndexes', cache.MusicDirectoryIndexes);
      console.log('ArtistIndexes', cache.ArtistIndexes);
      console.log('ArtistsById', cache.ArtistsById);
      console.log('ArtistsByName', cache.ArtistsByName);
      console.log('ArtistNames', cache.ArtistNames);
      console.log('Genres', cache.Genres);
    } else {
      console.warn(loginState);
    }
  }, [cache, Subsonic, isLoggedIn, musicFolderId, musicFolderLoaded, loginState]);

  return (
    <>
      <span onClick={tryAgain}>try again?</span>
      <hr/>
      <p>{JSON.stringify(cache)}</p>
    </>
  );
};

export const ContextDemo = (_props: any) => {
  const credentials = buildProcessEnvCredentials();
  console.warn(credentials);
  return (
      <SubsonicWrapper embeddedCredentials={credentials}>
        <div>
          <div>
            <Inner />
          </div>
        </div>
      </SubsonicWrapper>
  );
};
