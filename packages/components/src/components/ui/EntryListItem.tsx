import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

import { TipIconButton as IconButton } from './TipButton';

import { Generic, Subsonic } from '@subfire/core';
import { IdItemClick } from '@subfire/hooks';
import { SvgIcon } from '@mui/material';

export interface EntryListItemProps {
  useAvatar?: boolean
  subsonic: typeof Subsonic
  classes?: object,
  item: Generic
  index: Generic
  subtitle?: string
  showIndexText?: boolean
  onEntryClick?: IdItemClick
  onEntrySecondaryClick?: IdItemClick
  secondaryActionLabel?: string
  SecondaryIcon?: typeof SvgIcon
};

const styles = {
  listRoot: {
    width: '100%',
    overflow: 'auto',
    display: 'inline-block'
  },
  listItemText: {
  },
  subheader: {
    // backgroundColor: theme.palette.background.paper
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
}


export const EntryListItem = (props: EntryListItemProps) => {
  const {
    subsonic,
    item,
    index,
    subtitle,
    showIndexText,
    useAvatar,
    onEntryClick,
    onEntrySecondaryClick,
    secondaryActionLabel,
    SecondaryIcon
  } = props;

  if (!item) return <>huh</>;

  const avatar = useAvatar ? (
    <Avatar
      alt={`${item.name}`}
      src={subsonic.getCoverArtURL(item.coverArt, 40)}
      sx={[styles.avatar, styles.bigAvatar]}
    />
  ) : (
    <img
      alt={`${item.name}`}
      src={subsonic.getCoverArtURL(item.coverArt, 40)}
      style={{...styles.avatar, ...styles.bigAvatar}}
    />
  );
  return (
    <ListItem
      key={`item-${index.name || index.title}-${item.id}`}
      button
      onClick={() => { console.log('click'); onEntryClick(item.id); }}
    >
      <ListItemAvatar>{avatar}</ListItemAvatar>
      <ListItemText primary={`${item.name || item.title}`} sx={styles.listItemText}
        secondary={subtitle || (showIndexText ? (index.name || index.title) : null)} />
      {SecondaryIcon && (
        <ListItemSecondaryAction>
          <IconButton
            title={secondaryActionLabel}
            placement="left-end"
            aria-label={secondaryActionLabel}
            onClick={() => onEntrySecondaryClick(item.id)}
            size="large">
            <SecondaryIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default EntryListItem;
