import React, { MouseEventHandler } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { SvgIcon } from '@material-ui/core';

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
    <Tooltip title={(props.name || props.title || '') + (props.subTitle ? ' - ' + props.subTitle : '')} arrow placement="top-start">
      <ImageListItem style={props.style}>
        <img
          crossOrigin="anonymous"
          src={Subsonic.getCoverArtURL(coverArt as string, props.size || 192)}
          alt={props.name || props.title || ''}
          onClick={onImageClick}
          loading="lazy"
        />
        <ImageListItemBar
          title={props.name || props.title || ''}
          subtitle={props.subTitle || props.artist || ''}
          className={className}
          actionIcon={
            <IconButton onClick={onClick} style={{ color: '#fff' }}>
              <Icon />
            </IconButton>
          }
        />
      </ImageListItem>
    </Tooltip>
  );
};

export default CoverImageListItem;
