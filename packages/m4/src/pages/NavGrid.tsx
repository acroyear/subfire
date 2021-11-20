import { FuzzyImageBackground, isLandscape, useWindowSize } from '@subfire/components';
import React from 'react';
import { useHistory } from 'react-router-dom';

// import logo from 'subfirelib/static/logos/SubFire-192t.png';
import { Star, Radio, Album, FolderSpecial, People, QueueMusic, Bookmarks, RssFeed } from '@mui/icons-material';
import {Grid, Button } from '@mui/material';

/* eslint react/prop-types: 0 */
function NavGridItem(props: any) {
  return (
    <Grid item xs={props.variant === 'outlined' ? 6 : 12}>
      <Button {...props} style={{ textTransform: 'none', justifyContent: props.startIcon ? 'flex-start' : 'flex-end' }} />
    </Grid>
  );
}

function NavGrid(_props: any) {
  const history = useHistory();

  const go = (r: string) => history.push(r);
  const dimensions = useWindowSize();
  const variant = isLandscape(dimensions) ? 'outlined' : 'text';

  const items = [
    {
      children: 'Radio',
      startIcon: <Radio />,
      fullWidth: true,
      variant: variant,
      onClick: () => {
        go('/radio');
      }
    },
    {
      children: 'Playlists',
      endIcon: <QueueMusic />,
      fullWidth: true,
      variant: variant,
      onClick: () => {
        go('/playlists/normal');
      }
    },
    {
      children: 'Starred Items',
      startIcon: <Star />,
      fullWidth: true,
      variant: variant,
      onClick: () => {
        go('/starred');
      }
    },
    {
      children: 'Albums',
      endIcon: <Album />,
      fullWidth: true,
      variant: variant,
      onClick: () => {
        go('/albums');
      }
    },
    {
      children: 'Indexes',
      startIcon: <FolderSpecial />,
      fullWidth: true,
      variant: variant,
      disabled: false,
      onClick: () => {
        go('/indexes');
      }
    },
    {
      children: 'Artists',
      endIcon: <People />,
      fullWidth: true,
      variant: variant,
      disabled: false,
      onClick: () => {
        go('/artists');
      }
    },
    {
      children: 'Bookmarks',
      startIcon: <Bookmarks />,
      fullWidth: true,
      variant: variant,
      disabled: false,
      onClick: () => {
        go('/bookmarks');
      }
    },
    {
      children: 'Podcasts',
      endIcon: <RssFeed />,
      fullWidth: true,
      variant: variant,
      disabled: false,
      onClick: () => {
        go('/podcasts');
      }
    }
  ];
//   <FuzzyImageBackground
//   selector=".home-bg"
//   image={logo}
//   showBackground={true}
//   fadeBackground={true}
// />
  return (
    <>

      <Grid container spacing={dimensions.width < 600 ? 1 : 4} style={{marginTop: 5}}>
        {items.map(i => (
          <NavGridItem {...i} key={i.children} />
        ))}
      </Grid>
    </>
  );
}

export default NavGrid;
