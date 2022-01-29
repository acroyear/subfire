import React from "react";

import {
  Radio,
  Album,
  VideoLibrary,
  Shuffle,
  ThumbUp,
  Reply,
} from "@mui/icons-material";
import Button from "../ui/TipButton";

import { SubsonicTypes } from '@subfire/core';
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
type Generic = SubsonicTypes.Generic;

const useSxStyles = ((theme: Theme): Record<string, SxProps<Theme>> => ({
  button: {
    margin: theme.spacing(1),
  },
  buttonRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
  },
  buttonCell: {
    textAlign: "center",
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  }
}));

export interface ArtistActionButtonsPropTypes {
  history?: any;
  loadbase?: string;
  object?: Generic;
  id?: string;
  artistId?: string;
  isAlbum?: boolean;
  isArtist?: boolean;
  isSong?: boolean;
  showBackButton?: boolean;
  children?: React.ReactNode;
  onClick: (type: string) => void;
}

export const ArtistActionButtons: React.FC<ArtistActionButtonsPropTypes> = (props) => {
  let { id, showBackButton, onClick, children } = props;
  let { artistId, isArtist, isSong } = props;
  const isAlbum = !!artistId;
  isArtist = isArtist || isAlbum;
  const theme = useTheme();
  const styles = useSxStyles(theme);

  if (!artistId) artistId = id;
  let top = null as JSX.Element;
  let radio = null as JSX.Element;
  let backButton = null as JSX.Element;
  if (showBackButton && history) {
    backButton = (
      <Box sx={styles.buttonCell}>
        <Button placement="right-end" title="Go Back" onClick={() => onClick('back')}>
          <Reply />
        </Button>
      </Box>
    );
  }

  if (isArtist) {
    // music directory isn't fully in cache, so no name, so this doesn't work :()
    top = (
      <Box sx={styles.buttonCell}>
        <Button
          placement="right-end"
          title="Top Songs"
          onClick={() => {
            onClick('top');
          }}
        >
          <ThumbUp />
        </Button>
      </Box>
    );

    radio = (
      <Box sx={styles.buttonCell}>
        <Button
          placement="right-end"
          title="Radio"
          onClick={() => {
            onClick('radio');
          }}
        >
          <Radio />
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={styles.buttonRow}>
      {backButton}
      {top}
      {!isAlbum && (
        <>
          <Box sx={styles.buttonCell}>
            <Button
              placement="right-end"
              title="Play All"
              onClick={() => {
                onClick('all');
              }}
            >
              <VideoLibrary />
            </Button>
          </Box>
          <Box sx={styles.buttonCell}>
            <Button
              placement="right-end"
              title="Shuffle"
              onClick={() => {
                onClick('shuffle');
              }}
            >
              <Shuffle />
            </Button>
          </Box>
          <Box sx={styles.buttonCell}>
            <Button
              placement="right-end"
              title="Shuffle Albums"
              onClick={() => {
                onClick('shuffleAlbums');;
              }}
            >
              <Album />
            </Button>
          </Box>
        </>
      )}
      {isAlbum && (
        <>
          <Box sx={styles.buttonCell}>
            <Button
              placement="right-end"
              title="Play"
              onClick={() => {
                onClick('play');
              }}
            >
              <VideoLibrary />
            </Button>
          </Box>
          <Box sx={styles.buttonCell}>
            <Button
              title="Shuffle"
              onClick={() => {
                onClick('shuffleAlbum');
              }}
            >
              <Shuffle />
            </Button>
          </Box>
        </>
      )}
      {radio}
      {children}
    </Box>
  );
};

export const ArtistActionRouteButtons: React.FC<ArtistActionButtonsPropTypes> = (props) => {
  const { loadbase, history, id, artistId, isSong, showBackButton, children } = props;
  const onClick = (type: string) => {
    switch (type) {
      case 'back':
        history.goBack();
        break;
      case 'top':
        history.push(`/loading/${loadbase}/${artistId}/top`);
        break;
      case 'radio':
        history.push(`/loading/${loadbase}/${artistId}/radio`);
        break;
      case 'all':
        history.push(`/loading/${loadbase}/${artistId}/all`);
        break;
      case 'shuffleAlbum':
        history.push(`/loading/albumAction/${id}/shuffle`);
        break;
      case 'shuffle':
        history.push(`/loading/${loadbase}/${artistId}/shuffle`);
        break;
      case 'shuffleAlbums':
        history.push(`/loading/${loadbase}/${artistId}/shuffleAlbums`);
        break;
      case 'play':
        if (isSong) {
          // TODO
        } else {
          history.push(`/loading/albumAction/${id}/play`);
        }
        break;

    }
  }

  const aabProps: ArtistActionButtonsPropTypes = {
    onClick,
    id,
    artistId,
    isArtist: loadbase !== "directoryAction",
    isSong,
    showBackButton
  }
  return <ArtistActionButtons {...aabProps}>{children}</ArtistActionButtons>

}

export default ArtistActionRouteButtons