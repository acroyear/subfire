import React from 'react';
import { useSubsonic, useSubsonicQueue } from '@subfire/hooks';

import SongsList, { SongListProps } from './SongsList';
import { SongLiteItemContentsOptions } from './SongListItem';
import { Song } from '@subfire/core';

interface CurrentSongClicked {
  (s: Song): void
}

export interface CurrentSongListProps extends SongListProps {
  onSongClick: CurrentSongClicked
}

export const CurrentSongList: React.FC<Partial<CurrentSongListProps>> = props => {
  const { style, classes, className, onSongClick, children, stickyHeaderSize, ...rest } = props; // eslint-disable-line
  const { Subsonic } = useSubsonic();
  const { queue = [], idx = 0, current, set } = useSubsonicQueue();

  const onSongItemClick = (idx: number) => {
    set(queue, idx);
    onSongClick && onSongClick(queue[idx]);
  };

  const songItemProperties: SongLiteItemContentsOptions = {
    showCover: true,
    showMeta: true,
    showYear: true,
    showCompressed: true,
    showListIndex: true,
    onClick: onSongItemClick,
  };

  const songListProperties = {
    style,
    classes,
    className,
    songItemProperties,
    coverSize: 32,
    getCoverArtURL: Subsonic.getCoverArtURL,
    stickyHeaderSize
  };

  return <SongsList {...songListProperties} songs={queue} current={current}>{children}</SongsList>;
};

export default CurrentSongList;
