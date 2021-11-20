import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { createTheme, ThemeProvider, Theme, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import ReplyIcon from '@mui/icons-material/Reply';
import StarIcon from '@mui/icons-material/Star';
import { Airplay } from '@mui/icons-material';
import { RemoteTv } from 'mdi-material-ui';

import SettingsApplicationIcon from '@mui/icons-material/SettingsApplications';

import RssFeedIcon from '@mui/icons-material/RssFeed';
import BookmarksIcon from '@mui/icons-material/Bookmark';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import QueueMusic from '@mui/icons-material/QueueMusic'

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowBack from '@mui/icons-material/ArrowBack';

import amber from '@mui/material/colors/amber';
import indigo from '@mui/material/colors/indigo';
import { useSubsonic } from '@subfire/hooks';
import { ServerSelect, SubsonicAvatar } from '@subfire/components';

const styles = (theme: any) => ({
  appName: {
    flex: '1'
  },
  serverSelect: {
    flex: '1',
    maxWidth: '30%'
  },
  gutters: {
    paddingLeft: '8px',
    paddingRight: '8px'
  },
  avatar: {
    // background: theme.palette.secondary.dark,
    color: '#ffffff'
  }
});

// const theme2 = createTheme(adaptV4Theme({
//   palette: {
//     primary: amber,
//     secondary: indigo
//   },
//   typography: {},
//   overrides: {
//     MuiSelect: {
//       icon: {
//         color: '#000000'
//       }
//     },
//     MuiInputBase: {
//       root: {
//         color: '#000000'
//       }
//     },
//     MuiInput: {
//       underline: {
//         '&:before': {
//           borderBottom: '1px solid black'
//         },
//         '&:hover:not($disabled):not($focused):not($error):before': {
//           borderBottom: `2px solid black`,
//           // Reset on touch devices, it doesn't add specificity
//           '@media (hover: none)': {
//             borderBottom: `1px solid black`
//           }
//         }
//       }
//     }
//   }
// }));

function MainHeader(props: any): any {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useSubsonic();
  const history = useHistory();
  const { pathname } = useLocation();
  const { autoLandscape, toggleAutoLandscape } = props;
  // console.warn(history, pathname);

  const handleDrawer = (_event: any) => {
    setOpen(true);
  };

  const handleMenu = (event: any) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
    setOpen(null);
  };

  const { classes } = props;

  const menuItem = (
    <IconButton
      className={classes.menuButton}
      color="inherit"
      onClick={handleDrawer}
      size="large">
      <MenuIcon />
    </IconButton>
  );

  const backItem = (
    <IconButton
      className={classes.menuButton}
      color="inherit"
      onClick={history?.goBack}
      size="large">
      <ReplyIcon />
    </IconButton>
  );

  let topLeftItem = menuItem;

  if (
    pathname?.indexOf('/playlist/') >= 0 ||
    pathname?.indexOf('/directory/') >= 0 ||
    pathname?.indexOf('/album/') >= 0 ||
    pathname?.indexOf('/remoteControl') >= 0 ||
    pathname?.indexOf('/artist/') >= 0
  ) {
    topLeftItem = backItem;
  }

  const drawer = (
    <SwipeableDrawer open={Boolean(open)} onClose={handleClose} onOpen={handleDrawer}>
      <div tabIndex={0} role="button" onClick={handleClose} onKeyDown={handleClose}>
        <List className={classes.list}>
          <ListItem button={true} onClick={handleClose}>
            <ListItemIcon>
              <ArrowBack />
            </ListItemIcon>
            <ListItemText>Close</ListItemText>
          </ListItem>
          <ListItem button={true} component={Link} to="/loading/playQueue/0" onClick={handleClose}>
            <ListItemIcon>
              <QueuePlayNextIcon />
            </ListItemIcon>
            <ListItemText>Restore Play Queue</ListItemText>
          </ListItem>
          <ListItem button={true} component={Link} to="/playlists/all" onClick={handleClose}>
            <ListItemIcon>
              <QueueMusic />
            </ListItemIcon>
            <ListItemText>All Playlists</ListItemText>
          </ListItem>
          <ListItem button={true} onClick={toggleAutoLandscape}>
            <ListItemIcon>
              <Checkbox style={{ color: 'white' }} edge="start" checked={autoLandscape} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText>Auto Player for Landscape</ListItemText>
          </ListItem>
          <ListItem button={true} component={Link} to="/remoteConfig" onClick={handleClose}>
            <ListItemIcon>
              <Airplay />
            </ListItemIcon>
            <ListItemText>Configure Remote Listener</ListItemText>
          </ListItem>
          <ListItem button={true} component={Link} to="/remoteControl" onClick={handleClose}>
            <ListItemIcon>
              <RemoteTv />
            </ListItemIcon>
            <ListItemText>Remote Control</ListItemText>
          </ListItem>

          {/*
          <ListItem button={true} component={Link} to="/prefs" onClick={handleClose}>
            <ListItemIcon>
              <SettingsApplicationIcon />
            </ListItemIcon>
            <ListItemText>Preferences</ListItemText>
          </ListItem> */}

          <Divider />
          <ListItem>
            <ListItemText primary={'Version 3.14.0 ' + String.fromCharCode(169) + ' Joseph W Shelby, MIT License'} />
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  );
  /*
  <Divider />
  <MenuItem className={classes.drawerButton} component={Link} to="/remote" onClick={handleClose}>
    Remote Reciever
  </MenuItem>
  <MenuItem className={classes.drawerButton} component={Link} to="/remoteControl" onClick={handleClose}>
    Remote Control
  </MenuItem>
  // <RemoteSenderMenu variant="listItem" {...rsProps} />
  */

  const menu = (<Menu
    id="menu-appbar"
    anchorEl={menuAnchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    open={Boolean(menuAnchorEl)}
    onClose={handleClose}
  >
    <MenuItem className={classes.drawerButton} component={Link} to="/login" onClick={handleClose}>
      Credentials
    </MenuItem>
    <MenuItem className={classes.drawerButton} component={Link} to="/linkClient" onClick={handleClose}>
      Link Client
    </MenuItem>
    <MenuItem className={classes.drawerButton} component={Link} to="/linkSource" onClick={handleClose}>
      Link Source
    </MenuItem>
  </Menu>);

  /*
                <CastButton />
                <RemoteSenderMenuButton />

                 <ThemeProvider theme={theme2}>
                */

  return (
    <>
      <StyledEngineProvider injectFirst>

        <AppBar position="sticky">
          <Toolbar className={classes.gutters}>
            {topLeftItem}
            <Typography variant="h6" className={classes.appName}>
              <span
                id="title-span"
                style={{ color: 'black' }}
                onClick={() => {
                  history.push('/');
                }}
              >
                SubFire Mobile 3
              </span>
            </Typography>
            <div className={classes.serverSelect}>
              <ServerSelect isLoggedIn={isLoggedIn} />
            </div>
            <IconButton
              className={classes.menuButton}
              aria-owns={open ? 'menu-appbar' : null}
              aria-haspopup="true"
              onClick={handleMenu}
              size="large">
              <SubsonicAvatar />
            </IconButton>
          </Toolbar>
        </AppBar>

      </StyledEngineProvider>

      {drawer}

      {menu}
    </>
  );
}

MainHeader.propTypes = {
  classes: PropTypes.any,
  autoLandscape: PropTypes.bool,
  toggleAutoLandscape: PropTypes.func
};

export default withStyles(styles)(MainHeader);
