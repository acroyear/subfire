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
} from "../../hooks/SubsonicContext";
import { SubsonicTypes } from '@subfire/core';

import PlaylistSelect, { PlaylistSelectPropTypes } from './PlaylistSelect';
import RadioSelect from './RadioSelect';

export default {
    title: "browsers/PlaylistSelects",
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
            <Inner></Inner>
        </SubsonicWrapper>
    );
};

