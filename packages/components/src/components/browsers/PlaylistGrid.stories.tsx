import { useState } from "react";

import { useToggle } from "react-use";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import PlayArrow from '@material-ui/icons/PlayArrow';
import Shuffle from '@material-ui/icons/Shuffle';

import {
    SubsonicProvider,
    buildProcessEnvCredentials,
} from "../../hooks/SubsonicContext";
import { SubsonicTypes } from '@subfire/core';

import PlaylistGrid from './PlaylistGrid';
import RadioGrid from './RadioGrid';

export default {
    title: "browsers/PlaylistGrids",
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
    const Component: React.FC<any> = plType === 'stations' ? RadioGrid : PlaylistGrid;
    console.log(plType)
    const Icon = shuffle ? Shuffle : PlayArrow;
    return (
        <>
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
                    <Component actionIcon={Icon} playlistType={plType} />
                </div>
            </div>
        </>
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

