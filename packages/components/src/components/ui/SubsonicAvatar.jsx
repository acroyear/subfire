import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { useSubsonic } from 'subfirelib/hooks';

const useStyles = makeStyles(theme => ({
  avatar: {
    background: theme.palette.secondary.dark,
    color: '#ffffff'
  }
}));

function SubsonicAvatar(props) {
  const classes = useStyles();
  const { subsonic } = useSubsonic();

  const username = props.user || subsonic._u || 'X'; // eslint-disable-line
  const avatarURL = username === 'X' ? null : subsonic.getAvatarURL(username) || null;
  return (
    <Avatar className={classes.avatar} src={avatarURL}>
      {username.substring(0, 1).toUpperCase()}
    </Avatar>
  );
}

export default SubsonicAvatar;
