import React, { useState, useCallback, useEffect } from 'react'; // eslint-disable-line

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import { SortAscending, SortDescending } from '@mitch528/mdi-material-ui';
import { SubsonicTypes, utils } from '@subfire/core';

const { arrayShuffle } = utils;
export type Song = SubsonicTypes.Song;

export type Dir = 'asc' | 'desc' | 'unsorted';

export const SongSorterOptions = {
  unsorted: 'Unsorted',
  title: 'Title',
  path: 'Path',
  album: 'Album',
  artist: 'Artist',
  year: 'Year',
  created: 'Date Added',
  duration: 'Length',
  genre: 'Genre',
  random: 'Random',
  discTrack: "Disc/Track"
};

const numericProps = ['year', 'duration', 'discNumber', 'track'];
const numericProp = (prop: string) => numericProps.includes(prop);

export interface SongSorterSelectProperties {
  classes?: any
  sortProperty: string
  sortDirection: Dir
  fullWidth: boolean
  native: boolean
  label: string
  helperText: string
  id?: string
  onChange: (v: string, dir: Dir, forceReverse?: boolean) => void
}

let lastId = 0;

export const SongSorterSelect: React.FC<SongSorterSelectProperties> = props => {
  const { classes = {}, onChange, sortProperty = 'unsorted', sortDirection = 'asc', fullWidth, native, label, helperText, id, ...rest } = props;
  const theRest = {...rest} as any;
  const theOnChange = (evt: any) => {
    onChange(evt.target.value, sortDirection);
  };
  const theSortDirChange = (_evt: any) => {
    onChange(sortProperty, sortDirection === 'asc' ? 'desc' : 'asc', true);
  };

  const SortIcon = sortDirection === 'asc' ? SortAscending : SortDescending;

  const theId = id || ('song-sort' + ++lastId)

  const SelectComponent = native ? NativeSelect : Select;
  if (!native) theRest.displayEmpty = true;

  return (
    <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-end">
      <Box flexGrow={1}>
        <FormControl className={classes.formControl} fullWidth={fullWidth}>
          <InputLabel shrink htmlFor={theId}>
            {label || 'Sort By'}
          </InputLabel>
          <SelectComponent
            value={sortProperty}
            onChange={theOnChange}
            input={<Input name="sortby-input" id={theId} />}
            name="sortby"
            className={classes.selectEmpty}
            {...theRest}
          >
            {Object.entries(SongSorterOptions).map(([k, v]) => {
              return native ? (
                <option key={k} value={k}>
                  {v}
                </option>
              ) : (
                <MenuItem key={k} value={k}>
                  {v}
                </MenuItem>
              );
            })}
          </SelectComponent>
          {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
      </Box>
      <Box flexGrow={0}>
        <Button size="small" onClick={theSortDirChange}>
          <SortIcon />
        </Button>
      </Box>
    </Box>
  );
};

const removeArticles = (str: string): string => {
  const words = str.split(' ');
  if (words.length <= 1) return str;
  if (words[0] === 'a' || words[0] === 'the' || words[0] === 'an') return words.splice(1).join(' ');
  return str;
};

const compare = (a: string | number, b: string | number, dir: Dir, isNumericProp: boolean): number => {
  if (isNumericProp) {
    a = (a as number || 0) * 1;
    b = (b as number || 0) * 1;
    return dir === 'asc' ? a - b : b - a;
  }

  let aTitle = (a as string).toLowerCase(),
    bTitle = (b as string).toLowerCase();

  aTitle = removeArticles(aTitle);
  bTitle = removeArticles(bTitle);

  let rv = aTitle.localeCompare(bTitle);
  if (dir === 'desc') rv = rv * -1;
  return rv;
};

function sortFunction(prop: string, dir: Dir, prop2: string, prop3: string, contentProp: string, isNumericProp: boolean, a: Song, b: Song): number {
  // const av = ((contentProp ? a[contentProp][prop] : a[prop]) || '') + '';
  // const bv = ((contentProp ? b[contentProp][prop] : b[prop]) || '') + '';
  const av = a[prop] as string | number;
  const bv = b[prop] as string | number;
  const c = compare(av, bv, dir, isNumericProp);
  if (c !== 0) return c;
  return prop2 ? sortFunction(prop2, dir, prop3, null, contentProp, numericProp(prop2), a, b) : 0;
};

class SongComparison {
  prop: string; dir: Dir; prop2: string; prop3: string; contentProp: string; isNumericProp: boolean;
  constructor(prop: string, dir: Dir, prop2: string, prop3: string, contentProp: string, isNumericProp: boolean) {
    this.prop = prop;
    this.dir = dir;
    this.prop2 = prop2;
    this.prop3 = prop3;
    this.contentProp = contentProp;
    this.isNumericProp = isNumericProp;
  }

  songCompare = (a: Song, b: Song): number => {
    const av = a[this.prop] as string | number;
    const bv = b[this.prop] as string | number;
    const c = compare(av, bv, this.dir, this.isNumericProp);
    if (c !== 0) return c;
    if (!this.prop2) return 0;
    const sc = new SongComparison(this.prop2, this.dir, this.prop3, null, this.contentProp, numericProp(this.prop2));
    return sc.songCompare(a, b);
  }
}

export const sort = (prop: string, dir: Dir, songList: Song[], contentProp: string): Song[] => {
  let prop2 = null;
  let prop3 = null;
  if (prop === 'album') {
    prop2 = 'discNumber',
    prop3 = 'track';
  }
  if (prop === 'artist') {
    prop2 = 'album';
    prop3 = 'track';
  }
  if (prop === 'year') {
    prop2 = 'artist';
    prop3 = 'album';
  }
  if (prop === 'discTrack') {
    prop = 'discNumber',
    prop2 = 'track'
  }
  const sc = new SongComparison(prop, dir, prop2, prop3, contentProp, numericProp(prop));
  const rv = songList.slice().sort(sc.songCompare);
  return rv;
};

export interface SongSorterProperties {
  songList: Song[]
  setSongList: (songs: Song[], prop: string, dir: Dir) => void
  OptionsRenderer?: any // there are times ts + react sucks.  this is one of them.
  optionsRendererProps?: Object
  contentProp?: string
  sortProperty: string
  sortDirection: string
}

export const SongSorter: React.FC<SongSorterProperties> = (props) => {
  const {
    songList,
    setSongList,
    OptionsRenderer = SongSorterSelect,
    optionsRendererProps = {},
    contentProp = null,
    sortProperty,
    sortDirection = 'asc'
  } = props;

  const onChange = (newSortProperty: string, newSortDirection: Dir, forceReverse: boolean) => {
    let newSongList = songList;
    if (newSortProperty === 'unsorted') {
      if (forceReverse) {
        newSongList = [...songList.reverse()];
      }
    } else if (newSortProperty === 'random') {
      newSongList = arrayShuffle(songList);
    } else {
      newSongList = sort(newSortProperty, newSortDirection, songList, contentProp);
    }
    newSortProperty = newSortProperty === 'random' ? 'unsorted' : newSortProperty;
    setSongList(newSongList.slice(), newSortProperty, newSortDirection);
  };

  return (
    <OptionsRenderer onChange={onChange} sortProperty={sortProperty} sortDirection={sortDirection as Dir} {...optionsRendererProps} />
  );
};


export default SongSorter;
