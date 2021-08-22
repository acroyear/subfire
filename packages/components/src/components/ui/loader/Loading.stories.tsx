import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import LoadingCard from './LoadingCard';

// TODO: turn this into some sort of decorator
import { Subsonic, SubsonicTypes, utils } from '@subfire/core';
import { useSubsonicLoader } from './useSubsonicLoader';

const {sleep} = utils;

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

export const AlbumLoadingTest = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, clientName, false);
  Subsonic.connected = true;

  const [idx, setIdx] = useState(1);

  const album = async () => { console.log('0'); await sleep(5000); console.log('5'); return Subsonic.getAlbum("550") };
  const { card, result, error } = useSubsonicLoader(album, { id: "550", coverArt: "al-550", title: "I forgot..." });
  console.log(card, result, error);
  if (card) return (<>{card}</>);
  if (error) return <p>{JSON.stringify(error)}</p>;
  return <p>
    <button onClick={() => setIdx(idx => ++idx)}>Again {idx}</button><br />
    {JSON.stringify(result)}
  </p>;
}
