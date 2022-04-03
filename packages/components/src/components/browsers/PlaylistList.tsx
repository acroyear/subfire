import { FC, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { usePlaylistsScanner } from '@subfire/hooks';
import EntryList from '../ui/EntryList';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { SubfireRouterParams } from '../routing/RouterTypes';

import { RadioList } from './RadioList';
import { Generic, Playlist, PlaylistsType } from '@subfire/core';

function getSubTitle(g: Generic) {
    const pl = g as Playlist;
    const rv = pl.songCount + ' songs';
    return rv;
}

export interface PlaylistListPropTypes {
    onClick?: any
    onImageClick?: any
    playlistType?: PlaylistsType
    actionIcon: typeof PlayArrow
    scrollSelector?: string
}

export const PlaylistList: FC<PlaylistListPropTypes> = (props) => {
    const { onClick, onImageClick, scrollSelector, actionIcon } = props;
    let { playlistType } = props;
  
    if (playlistType === 'stations') {
      return RadioList(props);
    } else if (playlistType === 'normal') {
      playlistType = 'playlists';
    } else if (playlistType === 'all') {
      playlistType = 'allPlaylists';
    }

    const hasSeenWarningRef = useRef(false);
    const [pls, delay] = usePlaylistsScanner(); // eslint-disable-line

    if (!delay && !hasSeenWarningRef.current && playlistType === 'receivers') {
        hasSeenWarningRef.current = true;
        console.warn('Warning: playlists are not being refreshed regularly.');
    }

    const pl = (pls ? pls[playlistType || 'playlists'] : []) as Playlist[]

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


