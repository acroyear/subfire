import { useState } from "react";

import { useToggle } from "react-use";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import PlayArrow from '@mui/icons-material/PlayArrow';
import Shuffle from '@mui/icons-material/Shuffle';

import {
    SubsonicProvider,
    buildProcessEnvCredentials,
    PlaylistList
} from "../..";
import { SubsonicTypes } from '@subfire/core';

export default {
    title: "browsers/PlaylistLists",
};

const SubsonicWrapper: React.FC<any> = (props) => {
    console.warn(props);
    return (
        <SubsonicProvider
            clientName="SubfireStorybook"
            embeddedCredentials={props.embeddedCredentials}
        >
            {props.children}
        </SubsonicProvider>
    );
};

const Inner = (_props: any) => {
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
                    <PlaylistList actionIcon={Icon} playlistType={plType} scrollSelector="" />
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
            <Inner></Inner>
        </SubsonicWrapper>
    );
};

