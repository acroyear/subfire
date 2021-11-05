import { PlaylistGrid, SubfireRouterParams } from "@subfire/components";
import { useHistory, useParams } from "react-router";
import PlayArrow from '@mui/icons-material/PlayArrow';

export const Playlists = (_props: any) => {
    const history = useHistory();
    const { pltype } = useParams<SubfireRouterParams>();
    const Icon = PlayArrow;

    return <PlaylistGrid actionIcon={Icon} playlistType={pltype} scrollSelector="" onClick={(e: string) => {
        console.log('onClick', e);
        history.push(`/loading/playlist/${e}`);
    }}
        onImageClick={(e: string) => {
            console.log('onImageClick', e);
            history.push(`/playlist/${e}`);
        }} />;
}