import {
  PlaylistGrid,
  PlaylistList,
  SubfireRouterParams,
  useGridListSelector,
} from "@subfire/components";
import { useHistory, useParams } from "react-router";
import { PlayArrow } from "@mui/icons-material";

export const Playlists = (_props: any) => {
  const history = useHistory();
  const { pltype } = useParams<SubfireRouterParams>();
  const Icon = PlayArrow;

  const { gridListSwitch, useGrid, useList } = useGridListSelector();

  const grid = useGrid && (
    <PlaylistGrid
      actionIcon={Icon}
      playlistType={pltype}
      scrollSelector=""
      onClick={(e: string) => {
        console.log("onClick", e);
        history.push(`/loading/playlist/${e}`);
      }}
      onImageClick={(e: string) => {
        console.log("onImageClick", e);
        history.push(`/playlist/${e}`);
      }}
    />
  );

  const list = useList && (
    <PlaylistList
      actionIcon={Icon}
      playlistType={pltype}
      scrollSelector=""
      onClick={(e: string) => {
        console.log("onClick", e);
        history.push(`/loading/playlist/${e}`);
      }}
      onImageClick={(e: string) => {
        console.log("onImageClick", e);
        history.push(`/playlist/${e}`);
      }}
    />
  );

  return (
    <>
      {gridListSwitch}
      {grid}
      {list}
    </>
  );
};
