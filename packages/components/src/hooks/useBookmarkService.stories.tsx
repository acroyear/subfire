import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { SnackbarProvider } from 'notistack';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { useBookmarksService } from '@subfire/hooks';
import { buildProcessEnvCredentials } from '@subfire/hooks';

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


const BookmarkButton = (p: any) => {
  const { onClick, bookmarkIcon, id, bookmarkForId, ...rest } = p;
  return (
    <IconButton
      {...rest}
      onClick={evt => onClick(evt, id, bookmarkForId(id))}
      size="large">
      {bookmarkIcon(p.id)}
    </IconButton>
  );
};

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
      <BookmarkButton
        bookmarkForId={bookmarkForId}
        bookmarkIcon={bookmarkIcon}
        id="334"
        onClick={(_evt: any, id: string, b: Bookmark) => {
          if (b) {
            deleteBookmark(b.entry.id);
          } else {
            createBookmarkTest(_evt, id);
          }
        }}
      />
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
      <BookmarksTest></BookmarksTest>
    </SnackbarProvider>
  );
};
