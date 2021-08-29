import {FC, useRef } from 'react';
// import { useLocation, useParams } from 'react-router-dom';

import { usePlaylistsScanner } from '../../hooks/usePlaylists';
import SubsonicGridList from '../ui/SubsonicGridList';
import { SubsonicTypes } from '@subfire/core';
import PlayArrow from '@material-ui/icons/PlayArrow';

function getSubTitle(pl: SubsonicTypes.Playlist) {
  const rv = pl.songCount + ' songs';
  return rv;
}

export interface PlaylistGridPropTypes {
  onClick?: any
  onImageClick?: any
  playlistType: SubsonicTypes.PlaylistsType
  scrollSelector: string
}

export const PlaylistGrid: FC<PlaylistGridPropTypes> = (props) => {
  const { onClick, onImageClick, scrollSelector, playlistType } = props;
  const hasSeenWarningRef = useRef(false);
  const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line
  
  if (!delay && !hasSeenWarningRef.current && playlistType === 'receivers') {
    hasSeenWarningRef.current = true;
    console.warn('Warning: playlists are not being refreshed regularly.');
  }

  const pl = pls[playlistType || 'playlists'];

  return (
    <SubsonicGridList
      getSubTitle={getSubTitle}
      Icon={PlayArrow}
      content={pl}
      onClick={onClick}
      onImageClick={onImageClick}
      ScrollToTop
      scrollSelector={scrollSelector}
    />
  );
}

export default PlaylistGrid;
