import { useAsync } from 'react-use';
import { useCounter, useDeepCompareEffect } from 'react-use';

import { SubsonicTypes, Subsonic } from '@subfire/core';

import LoadingCard from '../components/ui/loader/LoadingCard';
import { AsyncState } from 'react-use/lib/useAsync';

export interface SubsonicLoaderResult<T> {
  state: AsyncState<any>,
  card: JSX.Element | null,
  result: T
  error: any
}

export function useSubsonicLoader<T>(f: () => Promise<T>, o?: Partial<SubsonicTypes.Generic>, top?: number): SubsonicLoaderResult<T> {
  o = o || {
    id: "-1",
    coverArt: "-1",
    title: "Something..."
  } as SubsonicTypes.Generic;
  top = top | 0;
  console.warn('id', o.id);
  const state = useAsync(f, [o.id]);
  console.debug(state);
  const card = state.loading ? <LoadingCard object={o} top={top} /> : null;
  const error = state.error ? state.error : null;
  const result = state.loading || state.error ? null : state.value as T;
  return {
    state, card, result, error
  }
}

interface _IdPartialPair {
  id: string,
  v: Partial<SubsonicTypes.Generic>
}

type _SubsonicFetchObject = string | Partial<SubsonicTypes.Generic>;

function genIdPartialPair(o: _SubsonicFetchObject, coverArtPrefix?: string): _IdPartialPair {
  let id: string, v: Partial<SubsonicTypes.Generic>;
  if (typeof o === 'string') {
    id = o;
    v = { id, coverArt: (coverArtPrefix || '') + id, title: "" };
  } else {
    id = o.id;
    v = o;
  }
  return { id, v };
}

export function useAlbum(o: _SubsonicFetchObject) {
  const { id, v } = genIdPartialPair(o, 'al-');
  return useSubsonicLoader(() => Subsonic.getAlbum(id), v);
}

export function useArtist(o: _SubsonicFetchObject) {
  const { id, v } = genIdPartialPair(o, 'ar-');
  return useSubsonicLoader(() => Subsonic.getArtist(id), v);
}

export function usePlaylist(o: _SubsonicFetchObject, fromCache?: boolean) {
  const { id, v } = genIdPartialPair(o, 'pl-');
  return useSubsonicLoader(() => Subsonic.getPlaylist(id, fromCache), v);
}

export function useMusicDirectory(o: _SubsonicFetchObject) {
  const { id, v } = genIdPartialPair(o);
  return useSubsonicLoader(() => Subsonic.getMusicDirectory(id), v);
}

export function useSong(o: _SubsonicFetchObject) {
  const { id, v } = genIdPartialPair(o);
  return useSubsonicLoader(() => Subsonic.getSong(id), v);
}

export function useNowPlaying() {
  return useSubsonicLoader(() => Subsonic.getNowPlaying());
}

export function useMusicFolders() {
  return useSubsonicLoader(() => Subsonic.getMusicFolders());
}

export function useGenres() {
  return useSubsonicLoader(() => Subsonic.getGenres());
}

export function usePlayQueue() {
  return useSubsonicLoader(() => Subsonic.getPlayQueue());
}

export function useArtists(id: number = -1) {
  const v = {
    id: "" + id,
    coverArt: '-1',
    title: "Artists in " + Subsonic.getMusicFolderCached("" + id).name
  }
  return useSubsonicLoader(() => Subsonic.getArtists(id), v);
}

export function useIndexes(id: number = -1) {
  const v = {
    id: "" + id,
    coverArt: '-1',
    title: "Indexes in " + Subsonic.getMusicFolderCached("" + id).name
  }
  return useSubsonicLoader(() => Subsonic.getIndexes(id), v);
}

export function useStarred(id: number = -1) {
  const v = {
    id: "" + id,
    coverArt: '-1',
    title: 'Starred in ' + Subsonic.getMusicFolderCached("" + id).name
  }
  return useSubsonicLoader(() => Subsonic.getStarred(id), v);
}

export function useSearch(s: string, params: SubsonicTypes.SearchCriteria, id: number = -1) {
  const v = {
    id: "" + id,
    coverArt: '-1',
    title: 'Searching for ' + s
  }
  return useSubsonicLoader(() => Subsonic.search(s, params, id), v);
}

export function useAlbumList(id3: boolean, params: SubsonicTypes.AlbumListCriteria): SubsonicLoaderResult<SubsonicTypes.AlbumListType[]> {
  const [count, { inc: inc }] = useCounter(0);
  useDeepCompareEffect(() => {
    console.log("changed", count);
    inc();
  }, [params, id3]);
  return useSubsonicLoader(() => Subsonic.getAlbumList(id3, params), { id: count + "", title: "Albums", coverArt: "-1" });
}

// increment fetch count to force server reload
export function useBookmarks(fetchCount: number) {
  return useSubsonicLoader(() => Subsonic.getBookmarks(), { id: "" + fetchCount, coverArt: '-1', title: 'Bookmarks' });
}