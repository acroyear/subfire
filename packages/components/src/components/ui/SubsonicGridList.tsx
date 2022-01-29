import React, { CSSProperties, useRef } from 'react';
import PropTypes from 'prop-types';

// import useComponentSize from '@rehooks/component-size';
import { useWindowSize, useComponentSize } from './orientation';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import PlayArrow from '@mui/icons-material/PlayArrow';

import CoverImageListItem from './CoverImageListItem';
import ScrollToTopFab from './ScrollToTopFab';
import { SubsonicTypes } from '@subfire/core';

const scrollIntoView = (i: number) => {
  const next = 'grid-category-header' + (i * 1 + 1);
  document.getElementById(next).scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth'
  });
};

export const SubsonicGridList = (props: any) => {
  // let ref = useRef(null);
  // let size = useComponentSize(ref);
  // console.log(size);
  // let { width } = size;
  const dimensions = useWindowSize();

  let { width } = dimensions;
  if (isNaN(width)) width = window.innerWidth;
  const gap = width > 640 ? 10 : 6;
  const cellSize = width > 640 ? 192 : 164;
  const cols = Math.floor(width / (cellSize + gap))
  const widthAfterPadding = cols * (cellSize + gap);

  const {
    onClick,
    onImageClick,
    Icon = PlayArrow,
    addScrollToTop = false,
    getSubTitle = (id: string) => '',
    sectionHeaderLabel,
    sectionHeaderIndex,
    sectionHeaderCount,
    content = [],
    scrollSelector
  } = props;

  const sectionHeader = !sectionHeaderLabel ? null : (
    <ListSubheader id={'grid-category-header' + sectionHeaderIndex} component="div">
      <Typography variant="h4">{sectionHeaderLabel}</Typography>
      {sectionHeaderIndex + 1 < sectionHeaderCount && (
        <ListItemSecondaryAction style={{ width: 48, height: 48 }}>
          <IconButton
            aria-label="Next"
            onClick={scrollIntoView.bind(this, sectionHeaderIndex)}
            size="large">
            <ArrowDownward />
          </IconButton>
        </ListItemSecondaryAction>
      )}
      {sectionHeaderIndex + 1 === sectionHeaderCount && (
        <ListItemSecondaryAction style={{ width: 48, height: 48 }}>
          <IconButton aria-label="First" onClick={scrollIntoView.bind(this, -1)} size="large">
            <ArrowUpward />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListSubheader>

  );

  const style = (addScrollToTop ? { paddingBottom: 75 } : {}) as CSSProperties;
  style.overflow = 'visible';
  style.width = widthAfterPadding;

  return (
    <div style={{ width: '100%' }}>

      {sectionHeader}
      <ImageList
        rowHeight={cellSize + 54}
        cols={cols}
        gap={gap}
        style={style}
        variant="standard"
      >
        {content.map((n: SubsonicTypes.Generic & { artist: string }) => (

          <CoverImageListItem
            onIconClick={onClick}
            onImageClick={onImageClick}
            key={'gl' + n.id}
            name={n.name}
            size={cellSize}
            artist={n.artist}
            title={n.title}
            subTitle={getSubTitle(n)}
            coverArt={n.coverArt}
            id={n.id}
            Icon={Icon}
            useIdforArt={false}
          />
        ))}
      </ImageList>
      {addScrollToTop && scrollSelector != null && <ScrollToTopFab selector={scrollSelector} />}

    </div>
  );
};

// SubsonicGridList.propTypes = {
//   Icon: PropTypes.object,
//   onClick: PropTypes.func,
//   onImageClick: PropTypes.func,
//   content: PropTypes.arrayOf(PropTypes.object),
//   ScrollToTop: PropTypes.bool,
//   getSubTitle: PropTypes.func,
//   sectionHeaderLabel: PropTypes.string,
//   sectionHeaderIndex: PropTypes.number,
//   sectionHeaderCount: PropTypes.number,
//   scrollSelector: PropTypes.string
// };

// SubsonicGridList.defaultProps = {
//   Icon: PlayArrow,
//   ScrollToTop: false,
//   getSubTitle: () => null
// };

export default SubsonicGridList;
