import React from "react";

import {
  Radio,
  Album,
  VideoLibrary,
  Shuffle,
  ThumbUp,
  Reply,
} from "@material-ui/icons";
import Button from "../ui/TipButton";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  buttonRow: {
    display: "flex",
    width: "100%",
    justifyContent: "space-around",
  },
  buttonCell: {
    textAlign: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export interface ArtistActionButtonsPropTypes {
  history?: any;
  loadbase?: string;
  id?: string;
  artistId?: string;
  isAlbum?: boolean;
  isArtist?: boolean;
  showBackButton?: boolean;
  children?: React.ReactNode;
  onClick: (type: string) => void;
}

export const ArtistActionButtons: React.FC<ArtistActionButtonsPropTypes> = (props) => {
  const { id, showBackButton, onClick, children } = props;
  let { artistId, isArtist } = props;
  const isAlbum = !!artistId;
  isArtist = isArtist || isAlbum;
  const classes = useStyles();

  // console.log(id, artistId, isAlbum);

  if (!artistId) artistId = id;
  let top = null as JSX.Element;
  let radio = null as JSX.Element;
  let backButton = null as JSX.Element;
  if (showBackButton && history) {
    backButton = (
      <div className={classes.buttonCell}>
        <Button placement="right-end" title="Go Back" onClick={() => onClick('back')}>
          <Reply />
        </Button>
      </div>
    );
  }

  if (isArtist) {
    // music directory isn't fully in cache, so no name, so this doesn't work :()
    top = (
      <div className={classes.buttonCell}>
        <Button
          placement="right-end"
          title="Top Songs"
          onClick={() => {
            onClick('top');
          }}
        >
          <ThumbUp />
        </Button>
      </div>
    );

    radio = (
      <div className={classes.buttonCell}>
        <Button
          placement="right-end"
          title="Radio"
          onClick={() => {
            onClick('radio');
          }}
        >
          <Radio />
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.buttonRow}>
      {backButton}
      {top}
      {!isAlbum && (
        <>
          <div className={classes.buttonCell}>
            <Button
              placement="right-end"
              title="Play All"
              onClick={() => {
                onClick('all');
              }}
            >
              <VideoLibrary />
            </Button>
          </div>
          <div className={classes.buttonCell}>
            <Button
              placement="right-end"
              title="Shuffle"
              onClick={() => {
                onClick('shuffle');
              }}
            >
              <Shuffle />
            </Button>
          </div>
          <div className={classes.buttonCell}>
            <Button
              placement="right-end"
              title="Shuffle Albums"
              onClick={() => {
                onClick('shuffleAlbums');;
              }}
            >
              <Album />
            </Button>
          </div>
        </>
      )}
      {isAlbum && (
        <>
          <div className={classes.buttonCell}>
            <Button
              placement="right-end"
              title="Play"
              onClick={() => {
                onClick('play');
              }}
            >
              <VideoLibrary />
            </Button>
          </div>
          <div className={classes.buttonCell}>
            <Button
              title="Shuffle"
              onClick={() => {
                onClick('shuffleAlbum');
              }}
            >
              <Shuffle />
            </Button>
          </div>
        </>
      )}
      {radio}
      {children}
    </div>
  );
};

export const ArtistActionRouteButtons: React.FC<ArtistActionButtonsPropTypes> = (props) => {
  const { loadbase, history, id, artistId, showBackButton, children } = props;
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
        history.push(`/loading/albumAction/${id}/play`)
        break;

    }
  }

  const aabProps: ArtistActionButtonsPropTypes = {
    onClick,
    id,
    artistId,
    isArtist: loadbase !== "directoryAction",
    showBackButton
  }
  return <ArtistActionButtons {...aabProps}>{children}</ArtistActionButtons>

}

export default ArtistActionRouteButtons