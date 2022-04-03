import React from 'react';
import Avatar from '@mui/material/Avatar';
import { useSubsonic } from '@subfire/hooks';
import { useTheme } from '@mui/material/styles';

export interface SubsonicAvatarProps {
  user?: string
}

export const SubsonicAvatar: React.FC<SubsonicAvatarProps> = (props) => {
  const { Subsonic: subsonic } = useSubsonic();
  const theme = useTheme();

  const avatar = {
    background: theme.palette.secondary.dark,
    color: '#ffffff'
  };

  const username = props.user || subsonic._u || 'X'; // eslint-disable-line
  const avatarURL = username === 'X' ? null : subsonic.getAvatarURL(username) || null;
  return (
    <Avatar sx={avatar} src={avatarURL}>
      {username.substring(0, 1).toUpperCase()}
    </Avatar>
  );
}

export default SubsonicAvatar;
