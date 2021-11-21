import { SongList, SubfireStation } from './SubsonicTypes';
import { Subsonic, SubsonicSongLoader } from './Subsonic';

interface Params {
    type: string
    id?: string
    mode?: string
    bookmarkId?: string
    position?: string
    station?: SubfireStation
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

const idp = (params: Params) => params.id;

const loaders: LoaderDescriptors = {
    playQueue: {
        method: () => Subsonic.getPlayQueueSongs
    },

    playlist: {
        method: () => Subsonic.getPlaylistSongs,
        param1: idp
    },
    radiostation: {
        method: () => Subsonic.generateStationSongs,
        param1: idp
    },
    station: {
        method: () => Subsonic.generateStationSongs,
        param1: idp
    },
    directory: {
        method: () => Subsonic.getMusicDirectorySongs,
        param1: idp,
        param2: () => false
    },
    directoryAction: {
        method: (params: Params) => {
            if (params.mode === 'shuffleAlbums') {
                return Subsonic.getMusicDirectoryAlbumSongs
            } else if (params.mode === 'radio') {
                return Subsonic.getTopSimilarSongs // THIS IS WRONG
            }
            return Subsonic.getMusicDirectorySongs
        },
        param1: idp,
        param2: (params: Params) => {
            if (params.mode === 'radio') return 200;
            return undefined;
        },
        param3: (params: Params) => {
            if (params.mode === 'radio') return 0;
            return undefined;
        }
    },
    song: {
        method: () => Subsonic.getSongAsList,
        param1: idp
    },
    albumAction: {
        // never really got far here
        method: () => Subsonic.getAlbumSongs,
        param1: idp
    },
    album: {
        method: () => Subsonic.getAlbumSongs,
        param1: idp
    },
    albumID3: { // legacy
        method: () => Subsonic.getAlbumSongs,
        param1: idp
    },
    artist: {
        method: () => Subsonic.getArtistSongs,
        param1: idp
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
        param1: idp,
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

export const SubsonicLoader = async (params: Params, shuffle: boolean = false): Promise<SongList> => {
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

    let rv = Subsonic.applyShuffleAndFlatten(songList, shuffle);
    rv = Object.assign(songList, rv) as SongList; // restore non-array parameters

    if (params.bookmarkId) {
        const si = rv.findIndex(r => r.id === params.bookmarkId);
        if (si === -1) {
            const e = await Subsonic.getSong(params.bookmarkId);
            rv.unshift(e);
            rv.current = 0;
            rv.position = parseInt(params.position || '0', 10);
        } else {
            rv.current = si;
            rv.position = parseInt(params.position || '0', 10);
        }
    }

    return rv;
}

