import React from 'react';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { makeStyles } from '@material-ui/core/styles';
import { TipIconButton as IconButton } from './TipButton';

import classNames from 'classnames';
import { Subsonic } from '@subfire/core';
import { IdItemClick } from '../../SubfireTypes';
import { SubsonicTypes } from "@subfire/core";
import { SvgIcon } from '@material-ui/core';

export interface EntryListItemProps {
  useAvatar?: boolean
  subsonic: typeof Subsonic
  classes?: object,
  item: SubsonicTypes.Generic
  index: SubsonicTypes.Generic
  showIndexText?: boolean
  onEntryClick?: IdItemClick
  onEntrySecondaryClick?: IdItemClick
  secondaryActionLabel?: string
  SecondaryIcon?: typeof SvgIcon
};

/* todo: change this to useStyles */

const useStyles = makeStyles(theme => ({
  listRoot: {
    width: '100%',
    overflow: 'auto',
    display: 'inline-block'
  },
  listItemText: {

  },
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  li: {
    listStyle: 'none'
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  avatar: {
    margin: 5
  },
  bigAvatar: {
    width: 40,
    height: 40
  }
}));

export const EntryListItem = (props: EntryListItemProps) => {
  const {
    subsonic,
    item,
    index,
    showIndexText,
    useAvatar,
    onEntryClick,
    onEntrySecondaryClick,
    secondaryActionLabel,
    SecondaryIcon
  } = props;

  const classes = useStyles();

  const avatar = useAvatar ? (
    <Avatar
      alt={`${item.name}`}
      src={subsonic.getCoverArtURL(item.coverArt, 40)}
      className={classNames(classes.avatar, classes.bigAvatar)}
    />
  ) : (
    <img
      alt={`${item.name}`}
      src={subsonic.getCoverArtURL(item.coverArt, 40)}
      className={classNames(classes.avatar, classes.bigAvatar)}
    />
  );
  return (
    <ListItem
      classes={{ container: classes.li }}
      key={`item-${index.name || index.title}-${item.id}`}
      button
      onClick={() => { console.log('click'); onEntryClick(item.id); }}
    >
      <ListItemAvatar>{avatar}</ListItemAvatar>
      <ListItemText primary={`${item.name || item.title}`} className={classes.listItemText}
        secondary={showIndexText ? (index.name || index.title) : null} />
      {SecondaryIcon && (
        <ListItemSecondaryAction>
          <IconButton title={secondaryActionLabel} placement="left-end" aria-label={secondaryActionLabel} onClick={() => onEntrySecondaryClick(item.id)}>
            <SecondaryIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default EntryListItem;
