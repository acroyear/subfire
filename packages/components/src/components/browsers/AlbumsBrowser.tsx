import React, { useState } from 'react';
import { useLocalStorage } from 'react-use';

import { PlayArrow, GridOn, ViewList } from '@mui/icons-material';
import { List, Switch } from '@mui/material';

import MusicFolderChooser from './MusicFolderChooser';
import { useSubsonic, useAlbumList } from '@subfire/hooks';

import { B } from '../ui/TGB';
import SubsonicGridList from '../ui/SubsonicGridList';
import EntryListItem from '../ui/EntryListItem';

import AlbumQueryChooser from '../controls/AlbumQueryChooser';
import { EntryList } from '../..';
import { Album, AlbumListCriteria, AlbumListCriteriaType, Generic } from '@subfire/core';

export interface AlbumsBrowserPropTypes {
  native?: boolean
  list?: boolean
  grid?: boolean
  SecondaryIcon?: any,
  secondaryActionLabel?: string,
  onAlbumClick?: (id: string) => void,
  onAlbumSecondaryClick?: (id: string) => void,
  scrollSelector?: string
};

export const AlbumsBrowser: React.FC<any> = props => {
  const { native, list, grid, onAlbumClick, onAlbumSecondaryClick, scrollSelector } = props;
  const { SubsonicCache: cache, Subsonic: subsonic, musicFolderId, isLoggedIn } = useSubsonic();

  const [albumQuery, setAlbumQuery] = useLocalStorage<AlbumListCriteriaType>('initAlbumQuery', 'recent');
  const [albumID3, setAlbumID3] = useLocalStorage<boolean>('initAlbumID3', false);
  const [toggleList, setToggleList] = useState(list || false);

  const onClick = (id: string) => {
    onAlbumClick(id, albumID3);
  };

  const onSecondaryClick = (id: string) => {
    onAlbumSecondaryClick(id, albumID3);
  }

  const params: AlbumListCriteria = {
    type: albumQuery,
    size: isLoggedIn ? 60 : 0
  };
  if (albumQuery.indexOf('byYear') === 0) {
    if (albumQuery === 'byYear reversed') {
      params.type = 'byYear';
      params.fromYear = 2100;
      params.toYear = 1500;
    } else {
      params.fromYear = 1500;
      params.toYear = 2100;
    }
  }

  if (musicFolderId !== -1) params.musicFolderId = musicFolderId;
  const status = useAlbumList(albumID3, params);

  if (status.error) {
    return <>{JSON.stringify(status.error)}</>
  }
  const albums = status.result;
  console.log(albums);

  const showGridListSelector = !(list || grid);
  const showGrid = grid || !toggleList;

  const handleChange = (event: any) => {
    setToggleList(event.target.checked);
  };
  const gridSelector = showGridListSelector ? (
    <B className="grid-list-select" alignItems="center">
      <GridOn />
      <Switch checked={list} onChange={handleChange} />
      <ViewList />
    </B>
  ) : null;

  const musicFolderChooser = <MusicFolderChooser native={native} />;

  const aqcProps = {
    list,
    grid,
    albumQuery,
    setAlbumQuery,
    albumID3,
    setAlbumID3,
    native,
    gridListToggle: gridSelector,
    musicFolderChooser
  };

  const getSubTitle = (a: Generic) => `${(a as Album).artist}  (${(a as Album).year})`;

  return (
    <>
      <AlbumQueryChooser {...aqcProps} />
      {status.card}
      {!status.card && showGrid && (
        <SubsonicGridList
          getSubTitle={getSubTitle}
          Icon={PlayArrow}
          content={albums}
          onClick={onSecondaryClick}
          onImageClick={onClick}
          ScrollToTop
          scrollSelector={scrollSelector}
        />
      )}
      {!status.card && !showGrid &&
        <EntryList
        Icon={PlayArrow}
        getSubTitle={getSubTitle}
        content={albums}
        onEntrySecondaryClick={onSecondaryClick}
        onEntryClick={onClick}
        ScrollToTop
        scrollSelector={scrollSelector}
    />}
    </>
  );
};

export default AlbumsBrowser;

/* 
      (<List>{
        albums.map(a => <EntryListItem key={a.id} item={a} index={{ name: 'albums' } as Generic} subsonic={subsonic}
          onEntryClick={onClick}
          onEntrySecondaryClick={onSecondaryClick}
          secondaryActionLabel="Play"
          SecondaryIcon={PlayArrow} />)
      }</List>)}
*/