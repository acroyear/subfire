import { FC, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { usePlaylistsScanner } from '../../hooks/usePlaylists';
import EntryList from '../ui/EntryList';
import { SubsonicTypes } from '@subfire/core';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { SubfireRouterParams } from '../routing/RouterTypes';

import { RadioList } from './RadioList';

function getSubTitle(g: SubsonicTypes.Generic) {
    const pl = g as SubsonicTypes.Playlist;
    const rv = pl.songCount + ' songs';
    return rv;
}

export interface PlaylistListPropTypes {
    onClick?: any
    onImageClick?: any
    playlistType?: SubsonicTypes.PlaylistsType
    actionIcon: typeof PlayArrow
    scrollSelector?: string
}

export const PlaylistList: FC<PlaylistListPropTypes> = (props) => {
    const { onClick, onImageClick, scrollSelector, playlistType, actionIcon } = props;
    if (playlistType === 'stations') {
        return RadioList(props);
    }

    const hasSeenWarningRef = useRef(false);
    const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line

    if (!delay && !hasSeenWarningRef.current && playlistType === 'receivers') {
        hasSeenWarningRef.current = true;
        console.warn('Warning: playlists are not being refreshed regularly.');
    }

    const pl = (pls ? pls[playlistType || 'playlists'] : []) as SubsonicTypes.Playlist[]

    return (
        <EntryList
            getSubTitle={getSubTitle}
            Icon={actionIcon || PlayArrow}
            content={pl}
            onEntrySecondaryClick={onClick}
            onEntryClick={onImageClick}
            ScrollToTop
            scrollSelector={scrollSelector}
        />
    );
}

export const PlaylistListR: FC<PlaylistListPropTypes> = (props) => {
    const { pltype } = useParams<SubfireRouterParams>();
    const newProps = {
        ...props,
        playlistType: pltype
    }
    return <PlaylistList {...newProps} />;
}

export default PlaylistList;


