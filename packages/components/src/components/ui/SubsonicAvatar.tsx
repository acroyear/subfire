import React from 'react';
import Avatar from '@mui/material/Avatar';
import { useSubsonic } from '@subfire/hooks';

// const useStyles = makeStyles(theme => ({
//   avatar: {
//     // background: theme.palette.secondary.dark,
//     color: '#ffffff'
//   }
// }));

export interface SubsonicAvatarProps {
  user?: string
}

export const SubsonicAvatar: React.FC<SubsonicAvatarProps> = (props) => {
  const classes = {avatar: ''}; // useStyles();
  const { Subsonic: subsonic } = useSubsonic();

  const username = props.user || subsonic._u || 'X'; // eslint-disable-line
  const avatarURL = username === 'X' ? null : subsonic.getAvatarURL(username) || null;
  return (
    <Avatar className={classes.avatar} src={avatarURL}>
      {username.substring(0, 1).toUpperCase()}
    </Avatar>
  );
}

export default SubsonicAvatar;
