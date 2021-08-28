import React from "react";
import PropTypes from "prop-types";

import Tooltip from "@material-ui/core/Tooltip";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import PlayArrow from "@material-ui/icons/PlayArrow";

import { Subsonic } from "@subfire/core";

const CoverGridTile = (props) => {
  const useIdforArt = props.useIdforArt;
  const className = props.variant || "";
  const Icon = props.Icon;
  const onClick = props.onClick
    ? props.onClick.bind(props.onClick, props.id)
    : null;
  const onImageClick = props.onImageClick
    ? props.onImageClick.bind(props.onImageClick, props.id)
    : null;
  const coverArt = props.coverArt || (useIdforArt ? props.id : null);
  return (
    <Tooltip
      title={
        (props.name || props.title || "") +
        (props.subTitle ? " - " + props.subTitle : "")
      }
      arrow
      placement="top-start"
    >
      <GridListTile style={props.style}>
        <img
          crossOrigin="anonymous"
          src={Subsonic.getCoverArtURL(coverArt, props.size)}
          alt={props.name || props.title || ""}
          onClick={onImageClick}
          loading="lazy"
        />
        <GridListTileBar
          title={props.name || props.title || ""}
          subtitle={props.subTitle || props.artist || ""}
          className={className}
          actionIcon={
            <IconButton onClick={onClick} style={{ color: "#fff" }}>
              <Icon />
            </IconButton>
          }
        />
      </GridListTile>
    </Tooltip>
  );
};

CoverGridTile.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string, // music directory when child recognized as an album
  subTitle: PropTypes.string, // populated by wrapper, defaults to artist for id3 album
  artist: PropTypes.string, // album or isDir album music directory
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func,
  onImageClick: PropTypes.func,
  size: PropTypes.number,
  Icon: PropTypes.object,
  variant: PropTypes.string,
  coverArt: PropTypes.string,
  useIdforArt: PropTypes.bool,
  style: PropTypes.any, // passed in from GridList, and needs to be passed down.
};

CoverGridTile.defaultProps = {
  size: 192,
  Icon: PlayArrow,
  useIdforArt: true,
};

export default CoverGridTile;
