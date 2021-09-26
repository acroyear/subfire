import React, { MouseEventHandler } from 'react';

import Tooltip from '@mui/material/Tooltip';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { SvgIcon } from '@mui/material';

import { Subsonic } from '@subfire/core';
import { IdItemClick } from '../../SubfireTypes';

export interface CoverImageListItemProps {
  name: string
  title?: string // music directory when child recognized as an album
  subTitle?: string // populated by wrapper defaults to artist for id3 album
  artist?: string // album or isDir album music directory
  id: string
  onClick?: IdItemClick
  onImageClick?: IdItemClick
  size?: number
  Icon?: typeof SvgIcon
  variant?: string
  coverArt?: string
  useIdforArt?: boolean
  style?: any // passed in from ImageList, and needs to be passed down.
}

export const CoverImageListItem: React.FC<CoverImageListItemProps> = (props: CoverImageListItemProps) => {
  const useIdforArt = (props.useIdforArt === null || props.useIdforArt === undefined) ? true : props.useIdforArt;
  const className = props.variant || '';
  const Icon = props.Icon || PlayArrow;
  // const onClick = props.onClick ? props.onClick.bind(props.onClick, props.id) : undefined;
  // const onImageClick = props.onImageClick ? props.onImageClick.bind(props.onImageClick, props.id) : undefined;
  const coverArt = props.coverArt || (useIdforArt ? props.id : null);

  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.id);
    }
  }

  const onImageClick = () => {
    if (props.onImageClick) {
      props.onImageClick(props.id);
    }
  }

  return (
    <ImageListItem sx={{ width: props.size }}>
      <Tooltip
        title={
          (props.name || props.title || "") +
          (props.subTitle ? " - " + props.subTitle : "")
        }
        arrow
        placement="top-start"
      >
        <img
          crossOrigin="anonymous"
          src={Subsonic.getCoverArtURL(coverArt, props.size)}
          alt={props.name || props.title || ""}
          onClick={onImageClick}
          loading="lazy"
        /></Tooltip>
      <ImageListItemBar
        sx={{ paddingLeft: 2}}
        title={props.name || props.title || ""}
        subtitle={props.subTitle || props.artist || ""}
        position="below"
        actionIcon={
          <IconButton onClick={onClick} size="large">
            <Icon />
          </IconButton>
        }
      />
    </ImageListItem>
  );
};

export default CoverImageListItem;
