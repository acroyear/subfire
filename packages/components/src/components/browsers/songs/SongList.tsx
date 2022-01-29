import React, { ElementType } from 'react';
import List from '@mui/material/List';

import SongListItem, { SongLiteItemContentsOptions } from './SongListItem';
import { SubsonicTypes } from '@subfire/core';

interface GetCoverArtFunction {
  (id: string, coverSize?: number): string
}

export interface SongListProps {
  style?: React.CSSProperties, 
  classes?: string, 
  className?: string,
  current: SubsonicTypes.Song, 
  component?: ElementType,
  songs: SubsonicTypes.SongList, 
  coverSize: number,
  songItemProperties: SongLiteItemContentsOptions, 
  getCoverArtURL: GetCoverArtFunction 
}

export const SongList: React.FC<SongListProps> = (props) => {
  const SongComponent = SongListItem;
  const { style, classes, className, current, component = 'ul', songs, coverSize = 22, songItemProperties, getCoverArtURL, children } = props;
  return (
    <List component={component} subheader={<li />} style={style} classes={classes} className={className}>
      <ul style={{padding: 0}}><li style={{padding: 0}}>
      {children}
      {songs.map((s: SubsonicTypes.Song, i: number) => {
        const song = { ...s, coverArtUrl: getCoverArtURL(s.id, coverSize), coverSize };
        return <SongComponent key={i} idx={i} {...songItemProperties} song={song} isCurrent={song.id === current?.id} />;
      })}</li></ul>
    </List>
  );
};

export default SongList;
