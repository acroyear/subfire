import { SongsList, SubfireRouterParams } from "@subfire/components";
import { Subsonic } from "@subfire/core";
import { usePlaylist } from "@subfire/hooks";
import { useParams } from "react-router-dom";

export const Playlist: React.FC<any> = (p) => {
  const { id } = useParams<SubfireRouterParams>();
  const pl = usePlaylist(id);

  if (pl.result === null) {
    return pl.card;
  }

  const getCoverArtURL = Subsonic.getCoverArtURL;

  return (
    <SongsList
      coverSize={48}
      current={null}
      getCoverArtURL={getCoverArtURL}
      songItemProperties={{}}
      songs={pl.result.entry}
    ></SongsList>
  );
};
