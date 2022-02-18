import React, { ReactEventHandler, Ref, useCallback, useEffect, useState } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { PlayerState, SubsonicTypes } from '@subfire/core';
import { useBookmarksService } from '../../hooks/useBookmarkService';

export interface BookmarkButtonProps extends IconButtonProps {
    id: string;
    onePerRule?: boolean;
    rule?: SubsonicTypes.BookmarkQueueRule;
    time?: React.RefObject<number>; // so time changes don't force a recreate of the function
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = (p) => {
    const { id, time, rule, onePerRule = true, size = "large", ...rest } = p;
    const { deleteBookmark, createSubfireBookmark, createBookmark, bookmarkForId, bookmarkIcon } = useBookmarksService(onePerRule);
    const bookmark = bookmarkForId(id);

    const bookmarkClick = useCallback(() => {
        console.warn('click', id, !!bookmark);
        if (bookmark) {
            deleteBookmark(id);
        } else {
            if (rule) {
                createSubfireBookmark(id, Math.trunc((time?.current || 0) * 1000), rule);
            } else {
                createBookmark(id, Math.trunc((time?.current || 0) * 1000), 'not a subfire bookmark');
            }
        }
    }, [id, bookmark, rule, time, createBookmark, createSubfireBookmark, deleteBookmark]);

    return (
        <IconButton
            {...rest}
            onClick={bookmarkClick}
            size={size}>
            {bookmarkIcon(p.id)}
        </IconButton>
    );
};
