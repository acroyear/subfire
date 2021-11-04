import { LoadingCard } from '../../..';

// TODO: turn this into some sort of decorator
import { Subsonic, utils } from '@subfire/core';

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook"
};
const {
  server,
  username,
  password,
  bitrate,
  clientName = "SubsonicStorybook",
} = credentials;

export default {
  title: 'ui/loading'
};

export const A_LoadingCard = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, clientName, false);
  const cardProps1 = {
    object: {
      name: 'The Playlist',
      id: '44',
      coverArt: 'pl-44'
    },
    top: 0
  };
  return (
    <>
      <LoadingCard {...cardProps1} />
    </>
  );
};

export const GenericLoadingCard = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, clientName, false);
  const cardProps1 = {
    object: {
      name: 'Something...',
      id: '-1',
      coverArt: '-1'
    },
    top: 0
  };
  return (
    <>
      <LoadingCard {...cardProps1} />
    </>
  );
}

