import { useAsync } from 'react-use';
import { SubsonicTypes } from '@subfire/core';

import LoadingCard from './LoadingCard';
import { AsyncState } from 'react-use/lib/useAsync';

export interface SubsonicLoaderResult<T> {
  state: AsyncState<any>,
  card: JSX.Element | null,
  result: T
  error: any
}

export function useSubsonicLoader<T>(f: () => Promise<T>, o: Partial<SubsonicTypes.Generic>, top?: number) : SubsonicLoaderResult<T> {
  o = o || {
    id: "-1",
    coverArt: "-1",
    title: "Something..."
  } as SubsonicTypes.Generic;
  top = top | 0;
  const state = useAsync(f, [o.id]);
  console.warn(state);
  const card = state.loading ? <LoadingCard object={o} top={top} /> : null;
  const error = state.error ? state.error : null;
  const result = state.loading || state.error ? null : state.value as T;
  return {
    state, card, result, error
  }
}
