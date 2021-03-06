import { FC, useRef } from 'react';
// import { useLocation, useParams } from 'react-router-dom';

import { usePlaylistsScanner } from '@subfire/hooks';
import SubsonicGridList from '../ui/SubsonicGridList';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { PlaylistListPropTypes } from './PlaylistList';
import { EntryList } from '../ui/EntryList';
import { Generic, Playlist, SubfireStation } from '@subfire/core';

function getSubTitle(g: Generic) {
  const pl = g as Playlist;
  const rv = pl.songCount + ' songs';
  return rv;
}

export const RadioList: FC<PlaylistListPropTypes> = (props) => {
  const { onClick, onImageClick, scrollSelector, actionIcon } = props;
  const hasSeenWarningRef = useRef(false);
  const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line

  if (!delay && !hasSeenWarningRef.current) {
    hasSeenWarningRef.current = true;
    console.warn('Warning: stations are not being refreshed regularly.');
  }

  const pl = pls?.stations || [] as SubfireStation[];

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
    { categories: [] as string[], categoryStations: {} as { [key: string]: SubfireStation[] } }
  );

  return (
    <>
      {sortedStations.categories.sort().map((c, i, a) => {
        const pl = sortedStations.categoryStations[c];
        return (
          <EntryList
            key={i}
            getSubTitle={getSubTitle}
            Icon={actionIcon || PlayArrow}
            content={pl}
            onEntrySecondaryClick={onClick}
            onEntryClick={onImageClick}
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

export default RadioList;
