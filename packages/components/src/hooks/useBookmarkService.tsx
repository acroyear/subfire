import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { SubsonicTypes, Subsonic } from '@subfire/core';
import { Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material';

import { useBookmarks } from './useSubsonicLoader';
import { useCounter } from 'react-use';

type Bookmark = SubsonicTypes.Bookmark;
type Bookmarks = SubsonicTypes.Bookmarks;
type Song = SubsonicTypes.Song;

interface QueueRule {
  type: string,
  id?: string,
  mode?: string,
  bookmarkSource: string
}

export const useBookmarksService = (onePerRule?: boolean) => {
  const [fetchCount, { inc: reloadBookmarks }] = useCounter(1);
  const bookmarkStatus = useBookmarks(fetchCount);
  const loadingCard = bookmarkStatus.card;
  const bookmarksError = bookmarkStatus.error;
  let bookmarks = bookmarkStatus.result || [];
  bookmarks = bookmarks.map(b => {
    const b2 = new SubsonicTypes.Bookmark();
    Object.assign(b2, b);
    return b2;
  }) as Bookmarks;
  const [replaceType, setReplaceType] = useState(onePerRule);
  const { enqueueSnackbar } = useSnackbar();

  const deleteBookmark = (bookmark: Bookmark | Song) => {
    const id = bookmark?.id;
    if (!id) return;
    Subsonic.deleteBookmark(id).then(() => {
      reloadBookmarks();
    });
  };

  const createBookmark = (id: string, position: number, comment: string) => {
    // console.log(id, position, comment);
    Subsonic.createBookmark(id, position, comment).then(() => {
      reloadBookmarks();
    });
  };

  const queueRuleToComment = (queueRule: QueueRule) => {
    return JSON.stringify({ ...queueRule, bookmarkSource: 'SubFire' } || '');
  };

  const deleteBookmarkByQueueRule = (qr: QueueRule) => {
    for (const b of bookmarks || []) {
      try {
        const bq = JSON.parse(b.comment) as QueueRule;
        if (!bq?.bookmarkSource || !bq?.type) {
          continue;
        }
        if (bq.type === qr.type && bq?.id === qr.id && bq?.mode === qr.mode) {
          deleteBookmark(b);
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
    createBookmark(id, position, queueRuleToComment(queueRule));
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
