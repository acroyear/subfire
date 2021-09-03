import { FC, useRef } from 'react';
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
  actionIcon: typeof PlayArrow
  scrollSelector: string
}

export const RadioGrid: FC<PlaylistGridPropTypes> = (props) => {
  const { onClick, onImageClick, scrollSelector, actionIcon } = props;
  const hasSeenWarningRef = useRef(false);
  const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line

  if (!delay && !hasSeenWarningRef.current) {
    hasSeenWarningRef.current = true;
    console.warn('Warning: stations are not being refreshed regularly.');
  }

  const pl = pls?.stations || [] as SubsonicTypes.SubfireStation[];

  const sortedStations = pl.reduce(
    (rv, n, _i, _ss) => {
      const thisCat = n.tag || 'Radio Stations';
      if (rv.categories.indexOf(thisCat) === -1) {
        rv.categories.push(thisCat);
        rv.categoryStations[thisCat] = [];
      }
      rv.categoryStations[thisCat].push(n);
      return rv;
    },
    { categories: [] as string[], categoryStations: {} as { [key: string]: SubsonicTypes.SubfireStation[] } }
  );

  return (
    <>
      {sortedStations.categories.sort().map((c, i, a) => {
        const pl = sortedStations.categoryStations[c];
        return (
          <SubsonicGridList
            key={i}
            getSubTitle={getSubTitle}
            Icon={actionIcon || PlayArrow}
            content={pl}
            onClick={onClick}
            onImageClick={onImageClick}
            sectionHeaderLabel={c}
            sectionHeaderIndex={i}
            sectionHeaderCount={a.length}
            ScrollToTop={i === a.length - 1}
            scrollSelector={scrollSelector}
          />
        );
      })}
    </>
  );
}

export default RadioGrid;
