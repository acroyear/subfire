import React from 'react';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { useSubsonicQueue } from '@subfire/hooks';

import SongList, { SongListProps } from './SongList';
import { SongLiteItemContentsOptions } from './SongListItem';

interface CurrentSongClicked {
  (s: SubsonicTypes.Song): void
}

export interface CurrentSongListProps extends SongListProps {
  onSongClick: CurrentSongClicked
}

const CurrentSongList: React.FC<Partial<CurrentSongListProps>> = props => {
  const { style, classes, className, onSongClick, children, ...rest } = props; // eslint-disable-line
  const { subsonic } = Subsonic;
  const { queue =  [], idx = 0 , current, set } = useSubsonicQueue();

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
    getCoverArtURL: subsonic.getCoverArtURL
  };

  return <SongList {...songListProperties} songs={queue} current={current}>{children}</SongList>;
};

export default CurrentSongList;
