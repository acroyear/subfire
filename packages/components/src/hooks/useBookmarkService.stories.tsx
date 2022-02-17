import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { SnackbarProvider } from 'notistack';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { useBookmarksService } from './useBookmarkService';
import { buildProcessEnvCredentials } from '@subfire/hooks';
import { BookmarkButton } from '../components/controls/BookmarkButton';

type Bookmark = SubsonicTypes.Bookmark;

// eslint-disable-next-line
export default {
  title: 'hooks/useBookmarkService'
};

const {
  server,
  username,
  password,
  bitrate,
  name = "SubsonicStorybook"
} = buildProcessEnvCredentials();


Subsonic.configure(server, username, password, bitrate, name, false);
Subsonic.connected = true;

const BookmarksTest = (props: any) => {
  let { bookmarks, deleteBookmark, createBookmark, bookmarkForId, bookmarkIcon, loadingCard, bookmarksError, reloadBookmarks } = useBookmarksService(false);
  bookmarks ||= [];

  const bookmarkList = (
    <ul>
      {bookmarks.map((b:Bookmark) => (
        <li key={b.entry.id}>{`${b.entry.title} - ${b.position} ${b.comment}`}</li>
      ))}
    </ul>
  );

  const createBookmarkTest = (_evt: any, id = '334') => {
    const b = bookmarkForId(id);
    if (b) {
      createBookmark(id, b.position + 10, 'test continued');
    } else {
      createBookmark(id, 10, 'test');
    }
  };

  const deleteBookmarkTest = (_evt: any) => {
    deleteBookmark(bookmarkForId('334').entry.id);
  };

  if (bookmarksError) {
    return (<>{bookmarksError}</>);
  }

  return (
    <>
      <button onClick={createBookmarkTest}>Create</button>
      <button onClick={deleteBookmarkTest}>Delete</button>
      {bookmarkIcon('334')}
      <button onClick={() => reloadBookmarks()}>Reload</button>
      {loadingCard || bookmarkList}
    </>
  );
};

export const Bookmarks = (_p: any) => {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: any) => () => {
    const c = notistackRef.current as any;
    c.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      action={key => (
        <Button style={{ color: '#ffffff' }} size="small" onClick={onClickDismiss(key)}>
          Dismiss
        </Button>
      )}
    >
      <BookmarkButton
        id="334"
      />
      <BookmarksTest></BookmarksTest>

    </SnackbarProvider>
  );
};
