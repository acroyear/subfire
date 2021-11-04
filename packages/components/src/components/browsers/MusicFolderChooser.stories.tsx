import React from 'react';
import { useSubsonic, SubsonicProvider, buildProcessEnvCredentials, MusicFolderChooser } from '../..';
export default {
  title: 'browsers/MusicFolders'
};

const {
  server,
  username,
  password,
  bitrate,
  name = "SubsonicStorybook"
} = buildProcessEnvCredentials();

const SubsonicWrapper: React.FC<any> = props => {
  console.warn(props);
  return (
    <SubsonicProvider clientName="SubfireStorybook" embeddedCredentials={props.embeddedCredentials}>
      {props.children}
    </SubsonicProvider>
  );
};


const Inner = (_props: any) => {
  const { SubsonicCache, musicFolderId } = useSubsonic();
  const { MusicDirectoryIndexes, ArtistIndexes } = SubsonicCache;
  const mdiCount =
    MusicDirectoryIndexes && MusicDirectoryIndexes[musicFolderId]
      ? MusicDirectoryIndexes[musicFolderId].length
      : 'loading';
  const aiCount = ArtistIndexes && ArtistIndexes[musicFolderId] ? ArtistIndexes[musicFolderId].length : 'loading';
  console.log(MusicDirectoryIndexes);
  console.log(ArtistIndexes);
  return (
    <>
      <span>Music Directory Indexes: {mdiCount}</span>
      <hr />
      <span>Artist Indexes: {aiCount}</span>
    </>
  );
};

export const Music_Folders = (_props: any) => {
  const credentials = buildProcessEnvCredentials();
  console.warn(credentials);
  return (
    <SubsonicWrapper embeddedCredentials={credentials}>
      <MusicFolderChooser native={false} />
      <MusicFolderChooser native={true} caption="Music Folder (native)" />
      <Inner />
    </SubsonicWrapper>
  );
};
