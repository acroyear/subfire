import React from 'react';
import { Gc, Gi, LoadingCard, MusicFolderChooser } from '../..';
import { useSubsonic, SubsonicProvider, buildProcessEnvCredentials } from '@subfire/hooks';
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
    <SubsonicProvider clientName="SubfireStorybook" embeddedCredentials={props.embeddedCredentials} LoadingCardComponent={LoadingCard}>
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
      <Gc>
        <Gi xs={12} sx={{paddingTop: 1, paddingBottom: 1}}><MusicFolderChooser native={false} selectId="mf1"/></Gi>
        <Gi xs={12} sx={{paddingTop: 1, paddingBottom: 1}}><MusicFolderChooser native={true} caption="Music Folder (native)" selectId="mf2"/></Gi>
        <Gi xs={12}><Inner /></Gi>
      </Gc>
    </SubsonicWrapper>
  );
};
