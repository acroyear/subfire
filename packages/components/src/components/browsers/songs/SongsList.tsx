import React, { ElementType } from 'react';
import List from '@mui/material/List';

import SongListItem, { SongLiteItemContentsOptions } from './SongListItem';
import { Song, SongList } from '@subfire/core';

interface GetCoverArtFunction {
  (id: string, coverSize?: number): string
}

export interface SongListProps {
  style?: React.CSSProperties,
  classes?: string,
  className?: string,
  current: Song,
  component?: ElementType,
  songs: SongList,
  coverSize: number,
  songItemProperties: SongLiteItemContentsOptions,
  getCoverArtURL: GetCoverArtFunction,
  stickyHeaderSize?: number
}

export const SongsList: React.FC<SongListProps> = (props) => {
  const SongComponent = SongListItem;
  const { style = {}, classes, className, current, component = 'ul', songs, coverSize = 22, songItemProperties, getCoverArtURL, stickyHeaderSize, children } = props;
  const scStyle: React.CSSProperties = {};
  if (stickyHeaderSize) {
    style.scrollMarginTop = stickyHeaderSize;
    scStyle.scrollMarginTop = stickyHeaderSize;
  }
  return (
    <List component={component} subheader={<li />} style={style} classes={classes} className={className}>
      <ul style={{ padding: 0 }}><li style={{ padding: 0 }}>
        {children}</li></ul>
      {songs.map((s: Song, i: number) => {
        const song = { ...s, coverArtUrl: getCoverArtURL(s.id, coverSize), coverSize };
        return <SongComponent style={scStyle} key={i} idx={i} {...songItemProperties} song={song} isCurrent={song.id === current?.id} />;
      })}
    </List>
  );
};

export default SongsList;
