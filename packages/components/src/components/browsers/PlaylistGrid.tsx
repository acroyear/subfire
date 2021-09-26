import {FC, useRef } from 'react';
// import { useLocation, useParams } from 'react-router-dom';

import { usePlaylistsScanner } from '../../hooks/usePlaylists';
import SubsonicGridList from '../ui/SubsonicGridList';
import { SubsonicTypes } from '@subfire/core';
import PlayArrow from '@mui/icons-material/PlayArrow';

function getSubTitle(pl: SubsonicTypes.Playlist) {
  const rv = pl.songCount + ' songs';
  return rv;
}

export interface PlaylistGridPropTypes {
  onClick?: any
  onImageClick?: any
  playlistType: SubsonicTypes.PlaylistsType
  actionIcon: typeof PlayArrow
  scrollSelector: string
}

export const PlaylistGrid: FC<PlaylistGridPropTypes> = (props) => {
  const { onClick, onImageClick, scrollSelector, playlistType, actionIcon } = props;
  const hasSeenWarningRef = useRef(false);
  const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line
  
  if (!delay && !hasSeenWarningRef.current && playlistType === 'receivers') {
    hasSeenWarningRef.current = true;
    console.warn('Warning: playlists are not being refreshed regularly.');
  }

  const pl = (pls ? pls[playlistType || 'playlists'] : []) as SubsonicTypes.Playlist[]

  return (
    <SubsonicGridList
      getSubTitle={getSubTitle}
      Icon={actionIcon || PlayArrow}
      content={pl}
      onClick={onClick}
      onImageClick={onImageClick}
      ScrollToTop
      scrollSelector={scrollSelector}
    />
  );
}

export default PlaylistGrid;
