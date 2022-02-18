import React, { ReactEventHandler, Ref, useCallback, useEffect, useState } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { PlayerState, SubsonicTypes } from '@subfire/core';
import QueueIcon from '@mui/icons-material/Queue';
import { useBookmarksService } from '../../hooks/useBookmarkService';

export interface SavePlayQueueButtonProps extends IconButtonProps {
    id: string;
    onePerRule?: boolean;
    queue: Array<SubsonicTypes.Song>;
    time: React.RefObject<number>; // so time changes don't force a recreate of the function
}

export const SavePlayQueueButton: React.FC<SavePlayQueueButtonProps> = (p) => {
    const { id, time, queue, onePerRule = true, size = "large", ...rest } = p;
    const { savePlayQueue } = useBookmarksService(onePerRule);

    const spqClick = useCallback(() => {
        savePlayQueue(queue || [], id, Math.trunc(time.current * 1000));
    }, [queue, time, id]);

    return (
        <IconButton
            {...rest}
            onClick={spqClick}
            size={size}>
            <QueueIcon/>
        </IconButton>
    );
};
