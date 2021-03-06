import { useState } from 'react';
import { action } from '@storybook/addon-actions';

// TODO: turn this into some sort of decorator
import { Subsonic, SubsonicLoader } from '@subfire/core';
import { buildProcessEnvCredentials } from '@subfire/hooks';
import { useAlbum, useBookmarks, useSubsonicLoader } from '@subfire/hooks';
import LoadingCard from '../components/ui/loader/LoadingCard';

const {
  server,
  username,
  password,
  bitrate,
  name = "SubsonicStorybook"
} = buildProcessEnvCredentials();

export default {
  title: 'hooks/useSubsonicLoader'
};

export const BookmarksLoadingTest = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, name, false);
  Subsonic.connected = true;

  const [idx, setIdx] = useState(1);
  const { card, result, error } = useBookmarks();
  console.log(card, result, error);
  if (card) return (<>{card}</>);
  if (error) return <p>{JSON.stringify(error)}</p>;
  return <p>
    <button onClick={() => setIdx(idx => ++idx)}>Again {idx}</button><br />
    {JSON.stringify(result)}
  </p>;
}

export const AlbumLoadingTestId = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, name, false);
  Subsonic.connected = true;

  const [idx, setIdx] = useState(1);
  const { card, result, error } = useAlbum('550');
  console.log(card, result, error);
  if (card) return (<>{card}</>);
  if (error) return <p>{JSON.stringify(error)}</p>;
  return <p>
    <button onClick={() => setIdx(idx => ++idx)}>Again {idx}</button><br />
    {JSON.stringify(result)}
  </p>;
}

export const AlbumLoadingTestPartial = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, name, false);
  Subsonic.connected = true;

  const [idx, setIdx] = useState(1);
  const { card, result, error } = useAlbum({ id: "551", coverArt: "al-551", title: "we should have this" });
  console.log(card, result, error);
  if (card) return (<>{card}</>);
  if (error) return <p>{JSON.stringify(error)}</p>;
  return <p>
    <button onClick={() => setIdx(idx => ++idx)}>Again {idx}</button><br />
    {JSON.stringify(result)}
  </p>;
}

export const GenericRouterStory = (_props: any) => {
  const [idx, setIdx] = useState(1);

  Subsonic.configure(server, username, password, bitrate, name, false);
  Subsonic.connected = true;
  const type = "album";
  const id = "551";
  const mode: string = null;
  const params = { type, id, mode };
  const o = Subsonic.constructFakeObject(type, id);
  const {
    state, card, result, error
  } = useSubsonicLoader(() => SubsonicLoader(params), o);

  console.log(card, result, error, state);
  if (card) return (<>{card}</>);
  if (error) return <p>{JSON.stringify(error)}</p>;
  return <p>
    <button onClick={() => setIdx(idx => ++idx)}>Again {idx}</button><br />
    {JSON.stringify(result)}
  </p>;
}