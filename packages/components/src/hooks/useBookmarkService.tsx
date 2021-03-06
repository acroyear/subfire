import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { Bookmark, Bookmarks, Song, BookmarkQueueRule, Subsonic } from '@subfire/core';
import { Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material';

import { useCounter } from 'react-use';
import { useBookmarks } from '@subfire/hooks';

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

  const deleteBookmarkByQueueRule = (qr: BookmarkQueueRule) => {
    for (const b of bookmarks || []) {
      try {
        const bq = JSON.parse(b.comment) as BookmarkQueueRule;
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

  const createSubfireBookmark = (id: string, position: number, queueRule: BookmarkQueueRule) => {
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
