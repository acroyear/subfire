import React, { useRef } from 'react';
import PropTypes from 'prop-types';

// import useComponentSize from '@rehooks/component-size';
import { useWindowSize, useComponentSize } from './orientation';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { makeStyles } from '@material-ui/core/styles';

import CoverGridTile from './CoverGridTile';
import ScrollToTopFab from './ScrollToTopFab';

const scrollIntoView = i => {
  const next = 'grid-category-header' + (i * 1 + 1);
  document.getElementById(next).scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth'
  });
};

const useStyles = makeStyles(theme => ({
  root: {
    // display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "space-around",
    // overflow: "hidden",
    // paddingLeft: 10
  },
  header: {
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    backgroundColor: '#000000'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}));

const SubsonicGridList = props => {
  // let ref = useRef(null);
  // let size = useComponentSize(ref);
  // console.log(size);
  // let { width } = size;
  const dimensions = useWindowSize();

  let {width} = dimensions;
  if (isNaN(width)) width = window.innerWidth;
  const spacing = width > 640 ? 10 : 6;
  const cellSize = width > 640 ? 170 : 164;
  const cols = width / (cellSize + spacing);
  const widthAfterPadding = cols * (cellSize + spacing);

  const {
    onClick,
    onImageClick,
    Icon,
    ScrollToTop,
    getSubTitle,
    sectionHeaderLabel,
    sectionHeaderIndex,
    sectionHeaderCount,
    content,
    scrollSelector
  } = props;

  const classes = useStyles();

  const sectionHeader = !sectionHeaderLabel ? null : (
    <GridListTile className={classes.header} cols={cols} style={{ height: 'auto' }}>
      <ListSubheader id={'grid-category-header' + sectionHeaderIndex} component="div">
        <Typography variant="h4">{sectionHeaderLabel}</Typography>
        {sectionHeaderIndex + 1 < sectionHeaderCount && (
          <ListItemSecondaryAction style={{ width: 48, height: 48 }}>
            <IconButton aria-label="Next" onClick={scrollIntoView.bind(this, sectionHeaderIndex)}>
              <ArrowDownward />
            </IconButton>
          </ListItemSecondaryAction>
        )}
        {sectionHeaderIndex + 1 === sectionHeaderCount && (
          <ListItemSecondaryAction style={{ width: 48, height: 48 }}>
            <IconButton aria-label="First" onClick={scrollIntoView.bind(this, -1)}>
              <ArrowUpward />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListSubheader>
    </GridListTile>
  );

  return (
    <div style={{ width: '100%' }}>
      <GridList
        cellHeight={cellSize}
        width={widthAfterPadding}
        cols={cols}
        spacing={spacing}
        style={ScrollToTop ? { paddingBottom: 75 } : {}}
      >
        {sectionHeader}
        {content.map(n => (
          <CoverGridTile
            onClick={onClick}
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
        {ScrollToTop && <ScrollToTopFab selector={scrollSelector} />}
      </GridList>
    </div>
  );
};

SubsonicGridList.propTypes = {
  Icon: PropTypes.object,
  onClick: PropTypes.func,
  onImageClick: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.object),
  ScrollToTop: PropTypes.bool,
  getSubTitle: PropTypes.func,
  sectionHeaderLabel: PropTypes.string,
  sectionHeaderIndex: PropTypes.number,
  sectionHeaderCount: PropTypes.number,
  scrollSelector: PropTypes.string
};

SubsonicGridList.defaultProps = {
  Icon: PlayArrow,
  ScrollToTop: false,
  getSubTitle: () => null
};

export default SubsonicGridList;
