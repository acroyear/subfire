import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { SubsonicTypes, Subsonic } from '@subfire/core';
import { Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material';

import { useBookmarks } from './useSubsonicLoader';
import { useCounter } from 'react-use';

type Bookmark = SubsonicTypes.Bookmark;
type Bookmarks = SubsonicTypes.Bookmarks;
type Song = SubsonicTypes.Song;
type QueueRule = SubsonicTypes.BookmarkQueueRule;

export const useBookmarksService = (onePerRule?: boolean) => {
  const bookmarkStatus = useBookmarks();
  const loadingCard = bookmarkStatus.card;
  const bookmarksError = bookmarkStatus.error;
  const bookmarks = bookmarkStatus.result || [];
  const [replaceType, setReplaceType] = useState(onePerRule);
  const { enqueueSnackbar } = useSnackbar();

  const reloadBookmarks = useCallback(() => {
    setTimeout(bookmarkStatus.state.retry, 10);
  }, [bookmarkStatus.state.retry]);

  const deleteBookmark = (id: string, reload: boolean = true) => {
    if (!id) return;
    Subsonic.deleteBookmark(id).then(() => {
      if (reload) { reloadBookmarks(); }
    });
  };

  const createBookmark = (id: string, position: number, comment: string) => {
    // console.log(id, position, comment);
    Subsonic.createBookmark(id, position, comment).then(() => {
      reloadBookmarks();
    });
  };

  const deleteBookmarkByQueueRule = (qr: QueueRule) => {
    for (const b of bookmarks || []) {
      try {
        const bq = JSON.parse(b.comment) as QueueRule;
        if (!bq?.bookmarkSource || !bq?.type) {
          continue;
        }
        if (bq.type === qr.type && bq?.id === qr.id && bq?.mode === qr.mode) {
          deleteBookmark(b.entry.id, false);
          break;
        }
      } catch (e) {
        // console.log('not a subfire', e);
      }
    }
  };

  const createSubfireBookmark = (id: string, position: number, queueRule: QueueRule) => {
    if (replaceType) {
      deleteBookmarkByQueueRule(queueRule);
    }
    createBookmark(id, position, Subsonic.bookmarkQueueRuleToComment(queueRule));
  };

  const bookmarkForId = (id: string) => (bookmarks || []).filter((b:Bookmark) => b.entry.id + '' === id + '')[0];

  const bookmarkIcon = (id: string) => (bookmarkForId(id) ? <BookmarkIcon /> : <BookmarkBorderIcon />);

  const savePlayQueue = (queue: Song[], id: string, position: number) => {
    const ids = queue.map((s) => s.id);
    Subsonic.savePlayQueue(ids, id, position).then((res) => {
      enqueueSnackbar('Play Queue Saved', {
        variant: 'success'
      });
    });
  }

  return {
    bookmarks,
    deleteBookmark,
    createBookmark,
    reloadBookmarks,
    createSubfireBookmark,
    bookmarkForId,
    bookmarkIcon,
    replaceType,
    setReplaceType,
    savePlayQueue,
    bookmarkStatus,
    loadingCard,
    bookmarksError
  };
};

export default useBookmarks;
