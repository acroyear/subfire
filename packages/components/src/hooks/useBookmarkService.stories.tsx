import React, { useEffect, useState } from 'react';
import { useBookmarksService } from './useBookmarkService';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { SnackbarProvider } from 'notistack';
import { Subsonic, SubsonicTypes } from '@subfire/core';

type Bookmark = SubsonicTypes.Bookmark;

// eslint-disable-next-line
export default {
  title: 'hooks/useBookmarkService'
};

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook"
};
const {
  server,
  username,
  password,
  bitrate,
  clientName = "SubsonicStorybook",
} = credentials;


const BookmarkButton = (p: any) => {
  const { onClick, bookmarkIcon, id, bookmarkForId, ...rest } = p;
  return (
    <IconButton {...rest} onClick={evt => onClick(evt, id, bookmarkForId(id))}>
      {bookmarkIcon(p.id)}
    </IconButton>
  );
};

Subsonic.configure(server, username, password, bitrate, clientName, false);
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
    deleteBookmark(bookmarkForId('334'));
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
            deleteBookmark(b);
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
