import { SongList } from './SubsonicTypes';
import { Subsonic, SubsonicSongLoader } from './Subsonic';

interface Params {
    type: string
    id?: string
    mode?: string
    bookmarkId?: string
}

interface ParamBuilder {
    (params?: Params): any
}

interface LoaderBuilder {
    (params?: Params): SubsonicSongLoader
}

interface LoaderDescriptor {
    method: LoaderBuilder
    param1?: ParamBuilder
    param2?: ParamBuilder
    param3?: ParamBuilder
    param4?: ParamBuilder
}

interface LoaderDescriptors {
    [key: string]: LoaderDescriptor
}

const loaders:LoaderDescriptors = {
    album: {
        method: () => Subsonic.getAlbumSongs,
        param1: (params: Params) => params.id
    },
    artist: {
        method: () => Subsonic.getArtistSongs,
        param1: (params: Params) => params.id
    },
    artistAction: {
        method: (params: Params) => {
            if (params.mode === 'shuffleAlbums') {
                return Subsonic.getArtistAlbumSongs
            } else if (params.mode === 'radio') {
                return Subsonic.getTopSimilarSongs
            } else if (params.mode === 'top') {
                return Subsonic.getTopArtistSongs
            }
            return Subsonic.getArtistSongs
        },
        param1: (params: Params) => params.id,
        param2: (params: Params) => {
            if (params.mode === 'radio') return 200;
            return undefined;
        },
        param3: (params: Params) => {
            if (params.mode === 'radio') return 0;
            return undefined;
        }
    }
}

export const SubsonicLoader = async (params: Params, shuffle: boolean = false) : Promise<SongList> => {
    const ld = loaders[params.type];
    if (!ld) return [];

    const method = ld.method(params);
    const p1 = (ld.param1 && ld.param1(params)) || undefined;
    const p2 = (ld.param2 && ld.param2(params)) || undefined;
    const p3 = (ld.param3 && ld.param3(params)) || undefined;
    const p4 = (ld.param4 && ld.param4(params)) || undefined;

    console.log(method, p1, p2, p3, p4);

    const songList = await method(p1, p2, p3, p4);

    console.log(songList);

    const rv = Subsonic.applyShuffleAndFlatten(songList, shuffle);

    return rv;
}