import { useState } from "react";

import { useToggle } from "react-use";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import PlayArrow from '@mui/icons-material/PlayArrow';
import Shuffle from '@mui/icons-material/Shuffle';

import {
    LoadingCard,
    PlaylistGrid,
    PlaylistList,
    PlaylistSelect,
    PlaylistSelectPropTypes,
    RadioSelect
} from "../..";
import { SubsonicTypes } from '@subfire/core';
import { buildProcessEnvCredentials, SubsonicProvider } from "@subfire/hooks";
import { action } from "@storybook/addon-actions";

export default {
    title: "browsers/Playlists",
};

const SubsonicWrapper: React.FC<any> = (props) => {
    console.warn(props);
    return (
        <SubsonicProvider
            clientName="SubfireStorybook"
            embeddedCredentials={props.embeddedCredentials}
            LoadingCardComponent={LoadingCard}
        >
            {props.children}
        </SubsonicProvider>
    );
};

const PlaylistGridInner = (_props: any) => {
    const [shuffle, toggleShuffle] = useToggle(false);
    const [plType, setPlType] = useState<SubsonicTypes.PlaylistsType>('playlists');
    console.log(plType)
    const Icon = shuffle ? Shuffle : PlayArrow;
    return (
        <div id="pg-root">
            Shuffle: <Switch checked={shuffle} onChange={toggleShuffle} />
            <br />
            <Select value={plType} onChange={(evt) => {
                const t = evt.target.value as SubsonicTypes.PlaylistsType;
                console.log('hi mom', t);
                setPlType(() => t);
            }}>
                <MenuItem value="playlists">Playlists</MenuItem>
                <MenuItem value="allPlaylists">All Playlists</MenuItem>
                <MenuItem value="stationPlaylists">Station Playlists</MenuItem>
                <MenuItem value="receivers">Receivers</MenuItem>
                <MenuItem value="myPlaylists">My Playlists</MenuItem>
                <MenuItem value="stations">Radio Stations</MenuItem>
            </Select>
            <div>
                <div>
                    <PlaylistGrid actionIcon={Icon} playlistType={plType} scrollSelector="" />
                </div>
            </div>
        </div>
    );
};

export const PlaylistGridsDemo = (_props: any) => {
    const credentials = buildProcessEnvCredentials();
    console.warn(credentials);
    return (
        <SubsonicWrapper embeddedCredentials={credentials}>
            <PlaylistGridInner></PlaylistGridInner>
        </SubsonicWrapper>
    );
};

const PlaylistListsInner = (_props: any) => {
    const [shuffle, toggleShuffle] = useToggle(false);
    const [plType, setPlType] = useState<SubsonicTypes.PlaylistsType>('playlists');
    console.log(plType)
    const Icon = shuffle ? Shuffle : PlayArrow;

    const onClick = (id: string) => {
        action('playlist button click ' + id);
    }

    const onRowClick = (id: string) => {
        action('playlist row click ' + id);
    }

    return (
        <div id="pg-root">
            Shuffle: <Switch checked={shuffle} onChange={toggleShuffle} />
            <br />
            <Select value={plType} onChange={(evt) => {
                const t = evt.target.value as SubsonicTypes.PlaylistsType;
                console.log('hi mom', t);
                setPlType(() => t);
            }}>
                <MenuItem value="playlists">Playlists</MenuItem>
                <MenuItem value="allPlaylists">All Playlists</MenuItem>
                <MenuItem value="stationPlaylists">Station Playlists</MenuItem>
                <MenuItem value="receivers">Receivers</MenuItem>
                <MenuItem value="myPlaylists">My Playlists</MenuItem>
                <MenuItem value="stations">Radio Stations</MenuItem>
            </Select>
            <div>
                <div>
                    <PlaylistList
                        onClick={onClick}
                        onImageClick={onRowClick}
                        actionIcon={Icon} playlistType={plType} scrollSelector="" />
                </div>
            </div>
        </div>
    );
};

export const PlaylistListsDemo = (_props: any) => {
    const credentials = buildProcessEnvCredentials();
    console.warn(credentials);
    return (
        <SubsonicWrapper embeddedCredentials={credentials}>
            <PlaylistListsInner></PlaylistListsInner>
        </SubsonicWrapper>
    );
};


const PlaylistSelectInner = (_props: any) => {
    const [native, toggleNative] = useToggle(false);
    const [plType, setPlType] = useState<SubsonicTypes.PlaylistsType>('playlists');
    const [playlistId, setPlaylistId] = useState<string>('');

    const Component: React.FC<any> = plType === 'stations' ? RadioSelect : PlaylistSelect;
    console.log(plType)

    const onChange = (id: string) => {
        setPlaylistId(() => id);
    }

    const playlistSelectProps: PlaylistSelectPropTypes = {
        playlistType: plType,
        includeEmpty: true,
        native,
        fullWidth: true,
        onChange,
        label: plType,
        value: playlistId
    }

    return (
        <>
            Native: <Switch checked={native} onChange={toggleNative} />
            <br />
            <Select value={plType} onChange={(evt) => {
                const t = evt.target.value as SubsonicTypes.PlaylistsType;
                console.log('hi mom', t);
                setPlType(() => t);
            }}>
                <MenuItem value="playlists">Playlists</MenuItem>
                <MenuItem value="allPlaylists">All Playlists</MenuItem>
                <MenuItem value="stationPlaylists">Station Playlists</MenuItem>
                <MenuItem value="receivers">Receivers</MenuItem>
                <MenuItem value="myPlaylists">My Playlists</MenuItem>
                <MenuItem value="stations">Radio Stations</MenuItem>
            </Select>
            <div style={{paddingTop: 25}}>
                <div>
                    <Component {...playlistSelectProps} />
                </div>
            </div>
        </>
    );
};

export const PlaylistsSelectsDemo = (_props: any) => {
    const credentials = buildProcessEnvCredentials();
    console.warn(credentials);
    return (
        <SubsonicWrapper embeddedCredentials={credentials}>
            <PlaylistSelectInner></PlaylistSelectInner>
        </SubsonicWrapper>
    );
};

