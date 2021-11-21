import {
  RadioGrid,
  RadioList,
  useGridListSelector,
} from "@subfire/components";
import { useHistory } from "react-router";
import { PlayArrow } from "@mui/icons-material";

export const Stations = (_props: any) => {
  const history = useHistory();
  const Icon = PlayArrow;

  const { gridListSwitch, useGrid, useList } = useGridListSelector();

  const grid = useGrid && (
    <RadioGrid
      actionIcon={Icon}
      scrollSelector=""
      onClick={(e: string) => {
        console.log("onClick", e);
        history.push(`/loading/station/${e}`);
      }}
      onImageClick={(e: string) => {
        console.log("onImageClick", e);
        history.push(`/loading/station/${e}`);
      }}
    />
  );

  const list = useList && (
    <RadioList
      actionIcon={Icon}
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
