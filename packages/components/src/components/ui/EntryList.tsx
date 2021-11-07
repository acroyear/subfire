import React, { CSSProperties } from 'react';

// import useComponentSize from '@rehooks/component-size';
import { useWindowSize, useComponentSize } from './orientation';

import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import PlayArrow from '@mui/icons-material/PlayArrow';
import makeStyles from '@mui/styles/makeStyles';
import EntryListItem from './EntryListItem';

import ScrollToTopFab from './ScrollToTopFab';
import { Styles } from '@mui/styles';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { IdItemClick } from '../../SubfireTypes';

const scrollIntoView = (i: number) => {
  const next = 'grid-category-header' + (i * 1 + 1);
  document.getElementById(next).scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'smooth'
  });
};

export interface EntryListProps {
  useAvatar?: boolean
  Icon?: any
  onEntryClick?: IdItemClick
  onEntrySecondaryClick?: IdItemClick
  content: Array<SubsonicTypes.Generic>
  ScrollToTop?: boolean
  scrollSelector?: string
  getSubTitle?: (g: SubsonicTypes.Generic) => string
  sectionHeaderLabel?: string
  sectionHeaderIndex?: number
  sectionHeaderCount?: number
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
    height: 'auto'
    // backgroundColor: theme.palette.background.paper
  },
  gridList: {
    backgroundColor: '#000000'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}));

export const EntryList: React.FC<EntryListProps> = (props) => {
  // let ref = useRef(null);
  // let size = useComponentSize(ref);
  // console.log(size);
  // let { width } = size;
  const dimensions = useWindowSize();

  let { width } = dimensions;
  if (isNaN(width)) width = window.innerWidth;
  const spacing = width > 640 ? 10 : 6;
  const cellSize = width > 640 ? 192 : 164;
  const cols = Math.floor(width / (cellSize + spacing))
  const widthAfterPadding = cols * (cellSize + spacing);

  const {
    useAvatar = false,
    onEntrySecondaryClick,
    onEntryClick,
    Icon = PlayArrow,
    ScrollToTop,
    scrollSelector,
    getSubTitle = () => { return 'default' },
    sectionHeaderLabel,
    sectionHeaderIndex,
    sectionHeaderCount,
    content = []
  } = props;

  const classes = useStyles();
  // <ImageListItem className={classes.header} cols={cols}>
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

  const style: CSSProperties = ScrollToTop ? { paddingBottom: 75 } : {};
  style.overflow = 'visible';

  return (
    <div style={{ width: '100%' }}>

      {sectionHeader}<List
        style={style}
      >
        {content.map((n: SubsonicTypes.Generic) => (
          <EntryListItem 
            subsonic={Subsonic}
            item={n} index={n} key={n.id}
            onEntryClick={onEntryClick} onEntrySecondaryClick={onEntrySecondaryClick}
            useAvatar={useAvatar}
            SecondaryIcon={Icon}
            secondaryActionLabel="Shuffle"
            subtitle={getSubTitle(n)}
          />
        ))}
      </List>
      {ScrollToTop && scrollSelector != null && <ScrollToTopFab selector={scrollSelector} />}

    </div>
  );
};

export default EntryList;
