import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { useRefCallbackHandler } from '@subfire/hooks';
import { Song } from '@subfire/core';

const overflow = (showCompressed: boolean): React.CSSProperties =>
  showCompressed ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {};

export interface SongLiteItemContentsOptions {
  showListIndex?: boolean,
  showMeta?: boolean,
  showCover?: boolean,
  showYear?: boolean,
  showCompressed?: boolean,
  coverSize?: number,
  onClick?: (i: number) => void,
  ref?: JSX.Element
}

export interface SongLiteItemContentValues {
  isCurrent: boolean,
  album: string,
  artist: string,
  coverArtUrl?: string,
  title: string,
  year: number,
  id: string,
  idx: number
}

export interface SongLiteItemContentParams extends SongLiteItemContentValues, SongLiteItemContentsOptions { }

export interface SongListItemContentParams extends SongLiteItemContentsOptions {
  song: Song,
  isCurrent: boolean,
  idx: number,
  style?: React.CSSProperties
}

const SongLiteItemContents = ({
  isCurrent,
  album,
  artist,
  coverArtUrl,
  title,
  year,
  id,
  idx,
  showListIndex,
  showMeta,
  showCover,
  showYear,
  showCompressed,
  coverSize,
  onClick,
  ref
}: SongLiteItemContentParams) => (
  <>
    {showCover && (
      <ListItemIcon
        style={{
          width: coverSize,
          height: coverSize,
          minWidth: showCompressed ? 40 : null
        }}
      >
        <img
          alt={title}
          src={coverArtUrl}
          style={{ width: coverSize, height: coverSize }}
          loading="lazy"
          crossOrigin="anonymous"
        />
      </ListItemIcon>
    )}
    <ListItemText
      style={{
        marginTop: showCompressed ? 4 : null,
        marginBottom: showCompressed ? 4 : null,
        ...overflow(showCompressed),
        fontStyle: isCurrent ? 'italic' : null
      }}
      primaryTypographyProps={{
        style: {
          lineHeight: showCompressed ? 'normal' : null,
          letterSpacing: showCompressed ? 'normal' : null,
          ...overflow(showCompressed)
        }
      }}
    >
      {showListIndex ? idx + 1 + '. ' : ''}
      {title}
      {showMeta && (
        <>
          <br />
          <Typography
            variant="caption"
            style={{
              lineHeight: showCompressed ? 'normal' : null,
              letterSpacing: showCompressed ? 'normal' : null,
              ...overflow(showCompressed)
            }}
          >
            {artist} - {album}
            {showYear && ` - (${year})`}
          </Typography>
        </>
      )}
    </ListItemText>
  </>
);

const SongListItem = (props: SongListItemContentParams) => {
  const { onClick, song, idx, style, ...rest } = props;
  const { showCompressed, isCurrent } = rest;
  const alreadyScrolled = useRef(false);
  const handler = (node: HTMLElement) => {
    if (node && isCurrent && node.scrollIntoView && !alreadyScrolled.current) {
      node.scrollIntoView();
      alreadyScrolled.current = true;
    }
  };

  useEffect(() => {
    return () => { alreadyScrolled.current = false; };
  }, []);

  const [ref] = useRefCallbackHandler(handler);
  const { id } = song;
  const styles = {...style} as React.CSSProperties;
  if (showCompressed) {
    styles.paddingLeft = 8;
    styles.paddingRight = 8;
    styles.paddingTop = 2;
    styles.paddingBottom = 2;
  }

  return (
    <ListItem
      ref={ref}
      style={styles}
      data-song-id={id}
      id={'songs-li-' + id}
      button={true}
      onClick={onClick && onClick.bind(onClick.prototype, idx)}
    >
      <SongLiteItemContents idx={idx} {...rest} {...song} />
    </ListItem>
  );
};

SongListItem.propTypes = {
  isCurrent: PropTypes.bool,
  album: PropTypes.string,
  artist: PropTypes.string,
  coverArtUrl: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  idx: PropTypes.number,
  showListIndex: PropTypes.bool,
  showMeta: PropTypes.bool,
  showCover: PropTypes.bool,
  showYear: PropTypes.bool,
  showCompressed: PropTypes.bool,
  coverSize: PropTypes.number,
  onClick: PropTypes.func,
  ref: PropTypes.any,
  song: PropTypes.object
};

export default SongListItem;

SongLiteItemContents.propTypes = SongListItem.propTypes;
