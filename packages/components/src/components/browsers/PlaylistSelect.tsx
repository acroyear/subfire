import React, { Component } from 'react';

import { Select, MenuItem, Input, InputLabel, FormControl, Checkbox, SelectProps, SelectChangeEvent } from '@mui/material';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { RvTruck } from 'mdi-material-ui';
import { usePlaylistsScanner } from '@subfire/hooks';

export interface PlaylistSelectPropTypes extends SelectProps<string> {
    onChange?: any
    playlistType: SubsonicTypes.PlaylistsType,
    includeEmpty?: boolean,
    fullWidth?: boolean,
    label?: string
}

export const PlaylistSelect = (props: PlaylistSelectPropTypes) => {
    const { includeEmpty, label, fullWidth, onChange, playlistType, ...selectProps } = props;
    const { native, value = '' } = selectProps;

    console.warn(value);

    const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line
    const pl = (pls ? pls[playlistType || 'playlists'] : []) as SubsonicTypes.Playlist[]

    const onSelectChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    }

    var emptyRef = includeEmpty ? (
        native ? (
            <option value="" />
        ) : (
            <MenuItem value="" />
        )
    ) : null;
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
                {pl.map((p, idx) => {
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
                                src={Subsonic.getCoverArtURL(
                                    p.coverArt,
                                    15
                                )}
                                alt={p.name}
                            />
                            &nbsp;
                            {p.name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>);

    return rv;
}

export default PlaylistSelect;
