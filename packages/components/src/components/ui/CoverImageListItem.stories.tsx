import React from 'react';
import { action } from '@storybook/addon-actions';
import { CoverImageListItem, CoverImageListItemProps} from './CoverImageListItem';

import Shuffle from '@mui/icons-material/Shuffle';
import ImageList from '@mui/material/ImageList';

import { Subsonic } from '@subfire/core';

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook"
};

const { server, username, password, bitrate, clientName = 'SubsonicStorybook' } = credentials;
Subsonic.configure(server, username, password, bitrate, clientName, false);

export default {
  title: 'ui/CoverImageListItem'
};

export const basic = () => {
  let innerWidth = window.innerWidth;
  const spacing = innerWidth > 360 ? 10 : 6;
  const cellSize = innerWidth > 360 ? 170 : 164;
  const cols = innerWidth / (cellSize + spacing);
  const width = cols * (cellSize + spacing);

  const props: CoverImageListItemProps = {
    name: 'Basic',
    subTitle: 'subTitle',
    onClick: action('play'),
    onImageClick: action('image.play'),
    id: '44',
    coverArt: 'pl-44',
    size: cellSize
  };

  return (
    <ImageList rowHeight={cellSize} cols={cols} gap={spacing}>
      <CoverImageListItem {...props} />
      <CoverImageListItem {...props} />
      <CoverImageListItem {...props} />
      <CoverImageListItem {...props} />
      <CoverImageListItem {...props} />
    </ImageList>
  );
};

export const shuffle = () => {
  let innerWidth = window.innerWidth;
  const spacing = innerWidth > 360 ? 10 : 6;
  const cellSize = innerWidth > 360 ? 170 : 164;
  const cols = innerWidth / (cellSize + spacing);
  const width = cols * (cellSize + spacing);
  const props: CoverImageListItemProps = {
    name: 'Basic',
    subTitle: 'subTitle',
    onClick: action('shuffle'),
    onImageClick: action('image.shuffle'),
    id: '1',
    coverArt: 'pl-1',
    Icon: Shuffle,
    size: cellSize
  };
  return (
    <ImageList rowHeight={cellSize} cols={cols} gap={spacing}>
      <CoverImageListItem {...props} />
      <CoverImageListItem {...props} />
    </ImageList>
  );
};
