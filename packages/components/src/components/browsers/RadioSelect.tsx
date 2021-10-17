import React, { Component } from 'react';

import { Select, MenuItem, Input, InputLabel, FormControl, Checkbox, SelectProps, SelectChangeEvent, ListSubheader } from '@mui/material';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { RvTruck } from '@mitch528/mdi-material-ui';
import { usePlaylistsScanner } from '../../hooks/usePlaylists';

import { PlaylistSelectPropTypes } from './PlaylistSelect';

export const RadioSelect = (props: PlaylistSelectPropTypes) => {
    const { includeEmpty, label, fullWidth, onChange, playlistType, ...selectProps } = props;
    const { native, value = '' } = selectProps;

    console.warn(value);

    const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line
    const pl = pls?.stations || [] as SubsonicTypes.SubfireStation[];

    const onSelectChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    }

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

    console.log(sortedStations);

    var emptyRef = includeEmpty ? (
        native ? (
            <option value="" key="__empty__" />
        ) : (
            <MenuItem value="" key="__empty__" />
        )
    ) : null;

    const options = sortedStations.categories.sort().map((c, i, a) => {
        const pl = sortedStations.categoryStations[c];

        const plOptions = pl.map((p, idx) => {
            // console.log('option', n.id, '' + selectedId === '' + n.id, n.name);
            if (native)
                return (
                    <option value={'' + p.id} key={'pl' + p.id + '-' + idx}>
                        {p.name}
                    </option>
                );
            return (
                <MenuItem value={'' + p.id} key={'pl' + p.id + '-' + idx}>
                    <img
                        crossOrigin="anonymous"
                        src={Subsonic.getCoverArtURL(p.coverArt, 15)}
                        alt={p.name}
                    />
                    &nbsp;
                    {p.name}
                </MenuItem>
            );
        });
        const catHeader = native ? ( <optgroup label={c} key={'cat-' + c}/> ) : (<ListSubheader key={'cat-' + c}>{c}</ListSubheader>);
        return [catHeader, ...plOptions];
    }).flat();

    console.log(options.length);
    console.log(options[0]);

    const rv = (
        <FormControl fullWidth={fullWidth}>
            <InputLabel htmlFor="pl-label">{label}</InputLabel>
            <Select
                {...selectProps}
                value={value}
                onChange={onSelectChange}
                id="pl-select"
                input={<Input id="pl-label" />}
            >
                {emptyRef}
                {options}
            </Select>
        </FormControl>);

    return rv;
}

export default RadioSelect;
