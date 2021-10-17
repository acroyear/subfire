import URI from '../js/utils/URI';
import md5 from '../js/utils/md5';
import { versionCompare, arrayUnique, hexEncode, empty, arrayShuffle } from '../js/utils/utils';
import { SubsonicCache } from './SubsonicCache';
import { SubsonicTypes } from '.';
import { Album, BookmarkQueueRule, Generic, MusicDirectory, SongList } from './SubsonicTypes';

const CurrentPromises = {} as { [key: string]: Promise<any> };

type CoverArtCache = { [key: string]: string }

export class SubsonicClass {
  constructor() {

  }

  serverAPIVersion: string = '1.13.0';
  _u: string = ''
  _s: string = ''
  _p: string = ''
  _b: string = '0'
  _c: string = 'SubFire4'
  _encP: string = ''
  connected: boolean = false
  coverArtCache: CoverArtCache = {}

  _initFromExisting = (s: SubsonicClass) => {
    this.serverAPIVersion = s.serverAPIVersion;
    this._u = s._u;
    this._s = s._s;
    this._p = s._p;
    this._b = s._b;
    this._c = s._c;
    this.coverArtCache = s.coverArtCache;
  }

  _buildURI = (method: string, params: any = {}): string => {
    const that = this;
    const uriString = this._s + '/rest/' + method + '.view';
    const uri = URI(uriString);
    uri.addQuery(params);
    uri.addQuery({
      v: that.serverAPIVersion,
      f: 'json',
      c: that._c,
      u: that._u
    });
    if (that._p && versionCompare(that.serverAPIVersion, '1.13.0') >= 0) {
      const s = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '');
      const t = md5(that._p + s);
      uri.addQuery({
        s: s,
        t: t
      });
    } else {
      // currently unsupported
      that._encP = 'enc:' + hexEncode(that._p);
      uri.addQuery({
        p: that._encP
      });
    }
    // console.log(params);
    // uri = uri + $.param(params, traditional);
    return uri.toString();
  }

  // I hate that i'm having to add this last
  _execute = (method: string, params: any = {}): Promise<any> => {
    const that = this;
    return new Promise((rs, rj) => {
      if (method !== 'ping' && that.connected === false) {
        rj({
          'subsonic-response': {
            status: 'failed',
            error: {
              code: '0',
              message: 'INTERNAL Not yet opened/verified.'
            }
          }
        });
      }

      const uri = that._buildURI(method, params);
      // console.log(uri);
      fetch(uri.toString())
        .then((res) => {
          if (!res.ok) {
            rj(res);
            return "";
          }
          return res.text();
        })
        .then((resText: string) => {
          // console.warn(resText);
          const res = JSON.parse(resText);
          const reply = res['subsonic-response'];
          // ampache returns "ok" but with error...
          if (reply.status === 'failed' || reply.error) {
            rj(reply);
          } else {
            // console.warn('resolve', method, reply);
            rs(reply);
          }
        })
        .catch((err) => {
          console.error(err);
          rj(err);
        });
    });
  }

  configure = (server: string, username: string, password: string, bitrate: string, clientName: string, doReset = true) => {
    this.serverAPIVersion = '1.13.0';
    this._u = username;
    this._s = server;
    this._b = bitrate || '0';
    this._p = password || '';
    // fix this
    this._c = clientName || 'SubFireLibDemoIncomplete';
    if (doReset) { SubsonicCache.reset(); }
  }

  open = (server: string, username: string, password: string, bitrate: string, clientName: string) => {
    this.connected = false;
    this.coverArtCache = {};

    // reset capabilities
    this.configure(server, username, password, bitrate, clientName);

    const that = this;
    return new Promise((rs, rj) => {
      that
        .ping()
        .then((res: any) => {
          that.serverAPIVersion = res.version;
          that.connected = true;
          rs(res);
        })
        .catch((err) => {
          console.warn('catch api check', err);
          if (err && err.error && err.error.code === 41) {
            that.serverAPIVersion = err.version;
            // console.warn('ping again', that._u, that._p);
            return that.ping();
          }
          that.connected = false;
          console.warn('reject');
          rj(err);
          return null;
        })
        .then((res2) => {
          // console.warn('backup try', res2);
          if (res2) {
            that.connected = true;
            rs(res2);
          }
        })
        .catch((err) => {
          // second ping failed, we really are invalid even on ampache.
          rj(err);
        });
    });
  }

  ping = () => {
    return this._execute('ping');
  }

  getNowPlaying = async (): Promise<SubsonicTypes.NowPlaying> => {
    const res = await this._execute('getNowPlaying');
    return res.nowPlaying;
  }

  getPlaylists = async (): Promise<SubsonicTypes.Playlist[]> => {
    const res = await this._execute('getPlaylists');
    // cache for easy access but it needs to be refreshed regularly so cache isn't permanent
    SubsonicCache.Playlists = res.playlists.playlist;
    return res.playlists.playlist;
  }

  getPlaylist = async (id: string, fromCache?: boolean): Promise<SubsonicTypes.Playlist> => {
    console.debug(id, fromCache);
    if (!id) return Promise.reject("no id");
    if (fromCache && SubsonicCache.Playlists[id]) {
      console.debug('returning from cache', SubsonicCache.Playlists[id]);
      return Promise.resolve(SubsonicCache.Playlists[id]);
    }

    const promiseKey = 'getPlaylist' + id;
    if (CurrentPromises[promiseKey]) {
      console.debug('returing existing promise', CurrentPromises[promiseKey]);
      const res = await CurrentPromises[promiseKey];
      return res.playlist;
    }

    const p = this._execute('getPlaylist', {
      id: id
    });
    console.debug('returning new fetch');
    CurrentPromises[promiseKey] = p;
    const res = await p;
    CurrentPromises[promiseKey] = null;
    if (fromCache) {
      console.log('caching');
      SubsonicCache.Playlists[id] = res.playlist;
    };
    return res.playlist;
  }

  getPlaylistSongs = async (id: string, fromCache?: boolean): Promise<SongList> => {
    const pl = await this.getPlaylist(id, fromCache);
    return pl.entry;
  }

  generateStationSongs = async(s: SubsonicTypes.SubfireStation): Promise<SongList> => {
    const sl = s.generateAll();
    return sl;
  }

  createPlaylist = (name: string, id?: string | null): Promise<SubsonicTypes.Playlist | null> => {
    const that = this;
    const promiseKey = 'createPlaylist' + name;
    if (CurrentPromises[promiseKey]) {
      // console.log('returning promise', MusicPathsPromises[key]);
      return CurrentPromises[promiseKey];
    }
    const thisPromise = new Promise<SubsonicTypes.Playlist | null>((rs, rj) => {
      const params = { name: name } as any;
      if (id) params.playlistId = id;
      return that
        ._execute('createPlaylist', params)
        .then((data: any) => {
          // console.log('new playlist', data);
          if (data.playlist) {
            rs(data.playlist);
            return data.playlist;
          }
          // 6.0b2: data will have the playlist so no need to do the rest of this, just rs()
          that.getPlaylists().then((p: SubsonicTypes.Playlist[]) => {

            const l = p.length;
            let m = id ? null : p[0];
            for (let i = 1; i < l; ++i) {
              if (id) {
                m = p[i].id === id ? p[i] : m;
              } else {
                if (m && p[i].name === name && parseInt(p[i].id, 10) > parseInt(m.id, 10) && p[i].owner === that._u) {
                  m = p[i];
                }
              }
            }
            rs(m);
          })
        })
        .catch((err) => {
          rj(err);
        })
        .finally(() => {
          delete CurrentPromises[promiseKey];
        });
    });
    CurrentPromises[promiseKey] = thisPromise;
    return thisPromise;
  }

  updatePlaylist = async (id: string, comment?: string, share?: boolean, name?: string, songsToAdd?: string[], indexesToRemove?: string[]): Promise<SubsonicTypes.Playlist> => {
    const params: any = {
      playlistId: id
    };
    if (comment) params.comment = comment;
    if (share === true || share === false) params.public = share;
    if (name) params.name = name;

    let playlistsParamSet: any[] = [];

    // first update - remove
    if (indexesToRemove) {
      playlistsParamSet[0] = Object.assign({}, params, { songIndexToRemove: indexesToRemove });
    }

    if (songsToAdd) {
      const reducer = (paramSet: any, song: string, idx: number, songs: string[]) => {
        const paramIdx = Math.floor(idx / 100);
        if (typeof paramSet[paramIdx] === 'undefined') {
          paramSet[paramIdx] = Object.assign({}, params, { songIdToAdd: [] });
        }
        paramSet[paramIdx].songIdToAdd.push(song);
        return paramSet;
      };
      playlistsParamSet = songsToAdd.reduce(reducer, playlistsParamSet);
    }

    // if neither happened, then just update - used for comments, share, name
    if (playlistsParamSet.length === 0) {
      playlistsParamSet[0] = Object.assign({}, params);
    }

    for (let p of playlistsParamSet) {
      const res = await this._execute('updatePlaylist', p);
      console.debug(res);
    }
    return this.getPlaylist(id);
  }

  deletePlaylist = (id: string): Promise<any> => {
    return this._execute('deletePlaylist', { id: id });
  }

  getMusicFolders = async (): Promise<SubsonicTypes.MusicFolders> => {
    if (!empty(SubsonicCache.MusicFolders)) {
      return Promise.resolve(SubsonicCache.MusicFolders);
    }
    const res = await this._execute('getMusicFolders');
    SubsonicCache.MusicFolders = res.musicFolders.musicFolder || [];
    SubsonicCache.MusicFolders.unshift({ id: -1, name: 'All Music Folders' });
    return SubsonicCache.MusicFolders;
  }

  getMusicFolderCached = (id: string): SubsonicTypes.MusicFolder => {
    const mf = SubsonicCache.MusicFolders;
    const m = mf.find(f => f.id + '' === id + '');
    if (m === undefined) throw ('Music Folder Not Found');
    return m;
  }

  getMusicFolder = async (id: string): Promise<SubsonicTypes.MusicFolder> => {
    const mf = await this.getMusicFolders();
    const m = mf.find(f => f.id + '' === id + '');
    if (m === undefined) throw ('Music Folder Not Found');
    return m;
  }

  getIndexes = async (id: number): Promise<SubsonicTypes.MusicDirectoryIndex[]> => {
    const key = id || -1;
    if (!empty(SubsonicCache.MusicDirectoryIndexes[key])) {
      return SubsonicCache.MusicDirectoryIndexes[key];
    }
    const params =
      id === null || id === undefined || id === -1
        ? {}
        : {
          musicFolderId: id
        };
    const res = await this._execute('getIndexes', params);
    const indexes = res.indexes as SubsonicTypes.MusicDirectoryIndexes;
    if (!Array.isArray(indexes.index))
      indexes.index = [indexes.index];
    SubsonicCache.MusicDirectoryIndexes[key] = indexes.index;
    return indexes.index;
  }

  getMusicDirectory = (id: string): Promise<SubsonicTypes.MusicDirectory> => {
    const key = (id || "-1") + '';
    const promiseKey = 'getMusicDirectory' + key;
    if (!empty(SubsonicCache.MusicPaths[key])) {
      // console.log('returning cache', key);
      return Promise.resolve(SubsonicCache.MusicPaths[key]);
    }
    if (CurrentPromises[promiseKey]) {
      // console.log('returning promise', MusicPathsPromises[key]);
      return CurrentPromises[promiseKey];
    }
    // console.log('first promise', key);
    const thisPromise = this._execute('getMusicDirectory', {
      id: id
    }).then(res => {
      SubsonicCache.MusicPaths[key] = res.directory;
      delete CurrentPromises[promiseKey];
      return res.directory;
    });
    CurrentPromises[promiseKey] = thisPromise;
    return thisPromise;
  }

  getGenres = async (): Promise<SubsonicTypes.Genres> => {
    if (!empty(SubsonicCache.Genres)) {
      return Promise.resolve(SubsonicCache.Genres);
    }
    const res = await this._execute('getGenres');
    SubsonicCache.Genres = res.genres?.genre || [];
    return SubsonicCache.Genres;
  }

  getArtists = async (id: number): Promise<SubsonicTypes.ArtistsIndex[]> => {
    const key = id || -1;
    if (!empty(SubsonicCache.ArtistIndexes[key])) {
      return SubsonicCache.ArtistIndexes[key];
    }
    const params =
      id === null || id === undefined || id === -1
        ? {}
        : {
          musicFolderId: id
        };
    const res = await this._execute('getArtists', params);
    const artists: SubsonicTypes.ArtistIndexes = res.artists;
    if (!artists.index)
      return artists.index;
    if (!Array.isArray(artists.index))
      artists.index = [artists.index];
    SubsonicCache.ArtistIndexes[key] = artists.index;
    if (key === -1) {
      for (let idx of SubsonicCache.ArtistIndexes[key]) {
        const artists = idx.artist;
        for (let a of artists) {
          SubsonicCache.ArtistsById[a.id] = a;
          SubsonicCache.ArtistsByName[a.name] = a;
          SubsonicCache.ArtistNames.push(a.name);
        }
      }
    }
    return artists.index;
  }

  getArtist = (id: string): Promise<SubsonicTypes.Artist> => {
    const key = id || "-1";
    const promiseKey = 'getArtist' + key;
    if (!empty(SubsonicCache.ArtistsById[key]) && !empty(SubsonicCache.ArtistsById[key].album)) {
      // console.log('return cache');
      return Promise.resolve(SubsonicCache.ArtistsById[key]);
    }
    // existing promise
    if (CurrentPromises[promiseKey]) {
      // console.log('return existing');
      return CurrentPromises[promiseKey];
    }
    // console.log('return new');
    const p = this._execute('getArtist', {
      id: id
    }).then(res => {
      // console.log('updated', res);
      SubsonicCache.ArtistsById[key] = res.artist;
      delete CurrentPromises[promiseKey];
      return res.artist;
    });
    CurrentPromises[promiseKey] = p;
    return p;
  }

  getAlbum = (id: string): Promise<SubsonicTypes.Album> => {
    const key = id || '-1';
    const promiseKey = 'getAlbum' + key;
    if (!empty(SubsonicCache.Albums[key]) && !empty(SubsonicCache.Albums[key])) {
      // console.log('return cache');
      return Promise.resolve(SubsonicCache.Albums[key]);
    }
    // existing promise
    if (CurrentPromises[promiseKey]) {
      // console.log('return existing');
      return CurrentPromises[promiseKey];
    }
    // console.log('return new');
    const p = this._execute('getAlbum', {
      id: id
    }).then(res => {
      // console.log('updated', res);
      SubsonicCache.Albums[key] = res.album;
      delete CurrentPromises[promiseKey];
      return res.album;
    });
    CurrentPromises[promiseKey] = p;
    return p;
  }

  // TODO: cache these and return the existing promise
  getTopSongs = async (name: string, count?: number): Promise<SongList> => {
    if (!name || name.length === 0) return [];
    const res = await this._execute('getTopSongs', {
      artist: name,
      count: count || 50
    });
    const songs = Array.isArray(res.topSongs.song) ? res.topSongs.song : [res.topSongs.song];
    return songs;
  }

  // TODO: if artist not there, try to find first
  getTopArtistSongs = (id: string, count?: number): Promise<SongList> => {
    return this.getTopSongs(SubsonicCache.ArtistsById[id]?.name, count);
  }

  getSong = async (id: string): Promise<SubsonicTypes.Song> => {
    const res = await this._execute('getSong', {
      id: id
    });
    return (res.song);
  }

  getSongAsList = async (id: string): Promise<SongList> => {
    const s = await this.getSong(id);
    return [s];
  }

  getStarred = async (musicFolderId: number): Promise<SubsonicTypes.SearchResult> => {
    const [star1, star2] = await Promise.all([this.getStarred1(musicFolderId), this.getStarred2(musicFolderId)])
    const rv: SubsonicTypes.SearchResult = {
      ...star2
    };
    if (star1.album) rv.albumDirectories = star1.album;
    if (star1.artist) rv.artistDirectories = star1.artist;
    return rv;
  }

  getStarred1 = async (musicFolderId: number): Promise<SubsonicTypes.SearchResult2> => {
    const params = musicFolderId && musicFolderId * 1 !== -1 ? { musicFolderId } : null;
    const res = await this._execute('getStarred', params);
    return res ? res.starred : {};
  }

  getStarred2 = async (musicFolderId: number): Promise<SubsonicTypes.SearchResult3> => {
    const params = musicFolderId && musicFolderId * 1 !== -1 ? { musicFolderId } : null;
    const res = await this._execute('getStarred2', params);
    return res ? res.starred2 : {};
  }

  getStarredSongs = async (musicFolderId: number): Promise<SongList> => {
    const star = await this.getStarred1(musicFolderId);
    return star.song || [];
  }

  search = async (s: string, params: SubsonicTypes.SearchCriteria, musicFolderId: number): Promise<SubsonicTypes.SearchResult> => {
    const [srch1, srch2] = await Promise.all([this.search2(s, params, musicFolderId), this.search3(s, params, musicFolderId)])
    const rv: SubsonicTypes.SearchResult = {
      ...srch2
    };
    if (srch1.album) rv.albumDirectories = srch1.album;
    if (srch1.artist) rv.artistDirectories = srch1.artist;
    return rv;
  }

  search2 = async (s: string, params: SubsonicTypes.SearchCriteria, musicFolderId: number): Promise<SubsonicTypes.SearchResult2> => {
    if (musicFolderId && musicFolderId * 1 !== -1) params.musicFolderId = musicFolderId;
    params.query = s;
    const res = await this._execute('search2', params);
    return res ? res.starred : {};
  }

  search3 = async (s: string, params: SubsonicTypes.SearchCriteria, musicFolderId: number): Promise<SubsonicTypes.SearchResult3> => {
    if (musicFolderId && musicFolderId * 1 !== -1) params.musicFolderId = musicFolderId;
    params.query = s;
    const res = await this._execute('search3', params);
    return res ? res.starred2 : {};
  }

  searchSongs = async (s: string, params: SubsonicTypes.SearchCriteria, musicFolderId: number): Promise<SongList> => {
    const sr = await this.search2(s, params, musicFolderId);
    return sr.song || [];
  }

  // getVideos = () => {
  //   return this._execute('getVideos');
  // }

  getAlbumList = async (id3: boolean, params: SubsonicTypes.AlbumListCriteria): Promise<SubsonicTypes.AlbumListType[]> => {
    if (id3) return this.getAlbumList2(params);
    return this.getAlbumList1(params);
  }

  getAlbumList1 = async (params: SubsonicTypes.AlbumListCriteria): Promise<SubsonicTypes.MusicDirectory[]> => {
    const res = await this._execute('getAlbumList', params);
    return res.albumList?.album || [];
  }

  getAlbumList2 = async (params: SubsonicTypes.AlbumListCriteria): Promise<SubsonicTypes.Album[]> => {
    const res = await this._execute('getAlbumList2', params);
    return res.albumList2?.album || [];
  }

  getRandomSongs = async (genre: string, fromYear: number, toYear: number, musicFolderId: number, size: number): Promise<SongList> => {
    const params: any = {};
    if (musicFolderId) params.musicFolderId = musicFolderId;
    if (genre) params.genre = genre;
    if (fromYear) params.fromYear = fromYear;
    if (toYear) params.toYear = toYear;
    params.size = size || 50;
    const res: SubsonicTypes.RandomSongs = await this._execute('getRandomSongs', params);
    const rv = res.randomSongs?.song || [];
    return rv;
  }

  getArtistInfo = (id: string, useID3: boolean, similarArtistCount: number = 20): Promise<SubsonicTypes.ArtistInfo> => {
    const key = 'getArtistInfo' + (id || "-1") + '-' + useID3;
    if (!empty(SubsonicCache.ArtistInfoById[key])) {
      console.log('return cache');
      return Promise.resolve(SubsonicCache.ArtistInfoById[key]);
    }
    // existing promise
    if (CurrentPromises[key]) {
      console.log('return existing');
      return CurrentPromises[key];
    }
    const method = useID3 ? 'getArtistInfo2' : 'getArtistInfo';
    const params = {
      id: id,
      count: similarArtistCount
    };
    const p = this._execute(method, params).then(res => {
      const ai = res.artistInfo || res.artistInfo2;
      const linkIndex = ai?.biography?.indexOf('<a') || -1;
      if (linkIndex >= -1) {
        ai.link = ai.biography.substring(linkIndex);
        ai.biography = ai.biography.substring(0, linkIndex);
      }
      SubsonicCache.ArtistInfoById[key] = ai;
      delete CurrentPromises[key];
      console.log('return fetch');
      return ai;
    });
    CurrentPromises[key] = p;
    return p;
  }

  getArtistInfo1 = (id: string, similarArtistCount?: number): Promise<SubsonicTypes.ArtistInfo> => {
    return this.getArtistInfo(id, false, similarArtistCount);
  }

  getArtistInfo2 = (id: string, similarArtistCount?: number): Promise<SubsonicTypes.ArtistInfo> => {
    return this.getArtistInfo(id, true, similarArtistCount);
  }


  // getAlbumInfo2 = (id) => {
  //   return this.getAlbumInfo(id, true);
  // },
  // getAlbumInfo = (id, useID3) => {
  //   const key = 'getAlbumInfo' + (id || -1) + '';
  //   if (!empty(SubsonicCache.AlbumInfoById[key])) {
  //     // console.log('return cache');
  //     return Promise.resolve(SubsonicCache.AlbumInfoById[key]);
  //   }
  //   // existing promise
  //   if (CurrentPromises[key]) {
  //     // console.log('return existing');
  //     return CurrentPromises[key];
  //   }
  //   const method = useID3 ? 'getAlbumInfo2' : 'getAlbumInfo';
  //   const params = {
  //     id: id
  //   };
  //   const p = this._execute(method, params).then(res => {
  //     const ai = res.albumInfo || res.albumInfo2;
  //     const linkIndex = ai?.notes?.indexOf('<a') || -1;
  //     if (linkIndex >= -1) {
  //       ai.link = ai.notes.substring(linkIndex);
  //       ai.notes = ai.notes.substring(0, linkIndex);
  //     }
  //     SubsonicCache.AlbumInfoById = ai;
  //     delete CurrentPromises[key];
  //     return ai;
  //   });
  //   CurrentPromises[key] = p;
  //   return p;
  // },

  getSimilarSongs1 = (id: string, count?: number) => {
    return this.getSimilarSongs(id, false, count);
  }

  getSimilarSongs2 = (id: string, count?: number) => {
    return this.getSimilarSongs(id, true, count);
  }

  getSimilarSongs = async (id: string, useID3?: boolean, count?: number): Promise<SongList> => {
    const method = useID3 ? 'getSimilarSongs2' : 'getSimilarSongs';
    const params = {
      id: id,
      count: count
    };
    const res = await this._execute(method, params);
    return res.similarSongs || res.similarSongs2;
  }

  savePlayQueue = (ids: string[], current: string, currentMediaTime?: number) => {
    const method = 'savePlayQueue';
    const params = {
      id: ids,
      current: current,
      position: currentMediaTime || 0
    };
    return this._execute(method, params);
  }

  getPlayQueue = async (): Promise<SubsonicTypes.PlayQueue> => {
    const res = await this._execute('getPlayQueue');
    return res.playQueue;
  }

  getPlayQueueSongs = async (): Promise<SongList> => {
    const pq = await this.getPlayQueue();
    const rv = pq.entry as SongList;
    rv.current = pq.current;
    rv.position = pq.position;
    return rv;
  }

  getChatMessages = async (since?: number): Promise<SubsonicTypes.ChatMessages> => {
    const res = await this._execute(
      'getChatMessages',
      since
        ? {
          since: since
        }
        : null
    );
    return res.chatMessages;
  }

  addChatMessage = (message: string) => {
    return this._execute('addChatMessage', {
      message: message
    });
  }

  createBookmark = (id: string, position: number, comment?: string) => {
    const params: any = {
      id: id,
      position: position
    };
    if (comment) params.comment = comment;
    return this._execute('createBookmark', params);
  }

  deleteBookmark = (id: string): Promise<any> => {
    const params = {
      id: id
    };
    return this._execute('deleteBookmark', params);
  }

  getBookmarks = async (): Promise<SubsonicTypes.Bookmarks> => {
    const res = await this._execute('getBookmarks', null);
    return res.bookmarks?.bookmark || [];
  }

  // getInternetRadioStations = () => {
  //   return this._execute('getInternetRadioStations', null);
  // },
  // createInternetRadioStation = (name, streamUrl, homepageUrl) => {
  //   return this._execute('createInternetRadioStation', {
  //     name: name,
  //     streamUrl: streamUrl,
  //     homepageUrl: homepageUrl
  //   });
  // },
  // updateInternetRadioStation = (id, name, streamUrl, homepageUrl) => {
  //   return this._execute('updateInternetRadioStation', {
  //     id: id,
  //     name: name,
  //     streamUrl: streamUrl,
  //     homepageUrl: homepageUrl
  //   });
  // },
  // deleteInternetRadioStation = (id) => {
  //   return this._execute('deleteInternetRadioStation', {
  //     id: id
  //   });
  // },

  getPodcasts = async (includeEpisodes?: boolean, id?: string): Promise<SubsonicTypes.Podcasts> => {
    const params: any = {};
    if (includeEpisodes) params.includeEpisodes = true;
    if (id) params.id = id;
    const res = await this._execute('getPodcasts', params);
    return res.podcasts;
  }

  getNewestPodcasts = async (count: number): Promise<SubsonicTypes.PodcastEpisode> => {
    const params: any = {};
    if (count) params.count = count;
    const res = await this._execute('getNewestPodcasts', params);
    return res.newestPodcasts?.episode;
  }

  categorizePlaylists = (p: SubsonicTypes.Playlist[]): SubsonicTypes.CategorizedPlaylists => {
    const playlists = p.filter((pl) => {
      pl.comment = pl.comment || '';
      return pl.comment.indexOf('{"radiostation"') !== 0 && !pl.name.startsWith('zz-sbr');
    });
    const receivers = p.filter(pl => pl.comment === 'pending' && pl.name.startsWith('zz-sbr') && pl.owner === this._u);
    const stationPlaylists = p.filter((pl) => {
      pl.comment = pl.comment || '';
      return pl.comment.indexOf('{"radiostation"') === 0;
    });

    const myPlaylists = playlists.filter(pl => pl.owner === this._u);

    return {
      allPlaylists: p,
      playlists,
      stationPlaylists,
      receivers,
      myPlaylists
    };
  }

  getCompleteAlbum = async (id: string): Promise<SubsonicTypes.CompleteAlbum> => {
    const album = await this.getAlbum(id);
    const rv: SubsonicTypes.CompleteAlbum = {
      ...album,
      song: [album.song]
    };
    return rv;
  }

  getSimilarArtists = async (id: string, count?: number, depth?: number): Promise<string[]> => {
    let c = empty(count) ? 10 : count,
      d = empty(depth) ? 2 : depth;
    let similarArtistsIds = ['' + id];
    const key = 'getArtistInfo' + id + '';
    console.log('cached', SubsonicCache.ArtistInfoById[key]);
    const info = SubsonicCache.ArtistInfoById[id] || await this.getArtistInfo2(id, count);
    if (info.similarArtist) {
      for (const a of info.similarArtist) {
        // cache artist name, because it may not be cached in station mode
        if (!SubsonicCache.ArtistsById[a.id]) SubsonicCache.ArtistsById[a.id] = a;
        similarArtistsIds.push(a.id);
        if (d) {
          const nextArtistsIds = await this.getSimilarArtists(a.id, c, d - 1);
          for (const naid of nextArtistsIds) {
            similarArtistsIds.push(naid);
          }
        }
      };
    }
    return similarArtistsIds;
  }

  getTopSimilarSongs = async (id: string, count?: number, depth?: number): Promise<SongList> => {
    let songs: SongList = [];
    const similarArtists = await this.getSimilarArtists(id, count, depth);
    for (const sa of similarArtists) {
      const ts = await this.getTopArtistSongs(sa);
      songs = [...songs, ...ts];
    }
    songs = arrayUnique(songs);
    return songs;
  }

  getMusicDirectoryAlbums = async (id: string): Promise<SongList[]> => {
    const md = await this.getMusicDirectory(id);
    const children = md.child || [];
    const songs: SongList = [];
    let rv: SongList[] = [];
    for (const c of children) {
      if (c.isDir) {
        const cs: SongList[] = await this.getMusicDirectoryAlbums(c.id);
        rv = [...rv, ...cs];
      } else {
        songs.push(c as SubsonicTypes.Song);
      }
    }
    rv = [songs, ...rv];
    return rv;
  }

  getMusicDirectoryAlbumSongs = async (id: string): Promise<SongList> => {
    const mda = await this.getMusicDirectoryAlbums(id);
    return this.applyShuffleAndFlatten(mda);
  }

  getMusicDirectorySongs = async (id: string, local: boolean = false): Promise<SongList> => {
    const md = await this.getMusicDirectory(id);
    const children = md.child || [];
    const songs: SongList = [];
    let rv: SongList = [];
    for (const c of children) {
      if (c.isDir) {
        if (!local) {
          const cs: SongList = await this.getMusicDirectorySongs(c.id);
          rv = [...rv, ...cs];
        }
      } else {
        songs.push(c as SubsonicTypes.Song);
      }
    }
    rv = [...songs, ...rv];
    return rv;
  }

  getArtistAlbums = async (id: string): Promise<SongList[]> => {
    let rv: SongList[] = [];
    const ar = await this.getArtist(id);
    if (!ar.album) return rv;
    for (const al of ar.album) {
      const a = await this.getAlbum(al.id);
      rv = [...rv, a.song];
    }
    return rv;
  }

  getArtistAlbumSongs = async(id: string): Promise<SongList> => {
    const aa = await this.getArtistAlbums(id);
    return this.applyShuffleAndFlatten(aa);
  }

  getArtistSongs = async (id: string): Promise<SongList> => {
    let rv: SongList = [];
    const ar = await this.getArtist(id);
    if (!ar.album) return rv;
    for (const al of ar.album) {
      const a = await this.getAlbum(al.id);
      rv = [...rv, ...a.song];
    }
    return rv;
  }

  getAlbumSongs = async (id: string):Promise<SongList> => {
    let rv: SongList = [];
    const al = await this.getAlbum(id);
    rv = [...al.song];
    return rv;
  }

  getPlaylistAsAlbumList = async (id: string, id3: boolean): Promise<SubsonicTypes.MusicDirectory[] | SubsonicTypes.Album[]> => {
    const pl = await this.getPlaylist(id);
    const rvM: SubsonicTypes.MusicDirectory[] = [];
    const rvA: | SubsonicTypes.Album[] = [];
    if (!pl.entry) return [];
    for (const p of pl.entry) {
      if (id3) {
        const a = {
          coverArt: p.coverArt,
          name: p.album,
          artist: p.artist,
          id: p.albumId,
          artistId: p.artistId,
          created: p.created
        } as Album;
        rvA.push(a);
      } else {
        const md = {
          coverArt: p.coverArt,
          name: p.album,
          artist: p.artist,
          id: p.parent
        } as MusicDirectory;
        rvM.push(md);
      }
    }
    if (id3) return rvA;
    return rvM;
  }

  getAvatarURL = (username: string) => {
    username = username || this._u;
    const key = 'av-' + username;
    let url;
    const firstUrl = this.coverArtCache[key];
    if (!firstUrl) {
      url = this._buildURI('getAvatar', { username: username });
      this.coverArtCache[key] = url;
    } else {
      // console.log("match", "using", firstUrl);
      url = firstUrl;
    }
    return url;
  }

  getCoverArtURL = (id: string, size: number) => {
    const params: any = {
      id: id || -1
    };
    let url;
    if (size) params.size = size;
    const key = id + '--' + size; // trimImageUrlEssentials(url);
    const firstUrl = this.coverArtCache[key];
    if (!firstUrl) {
      url = this._buildURI('getCoverArt', params);
      this.coverArtCache[key] = url;
    } else {
      // console.log("match", "using", firstUrl);
      url = firstUrl;
    }
    return url;
  }

  getHLSURL = (id: string, params?: object) => {
    params = Object.assign(
      {
        id: id,
        maxBitRate: this._b
      },
      params || {}
    );
    return this._buildURI('hls', params);
  }

  getStreamingURL = (id: string, params?: object) => {
    params = Object.assign(
      {
        id: id,
        maxBitRate: this._b
      },
      params || {}
    );
    return this._buildURI('stream', params);
  }

  getDownloadURL = (id: string) => {
    return this._buildURI('download', {
      id: id
    });
  }

  applyShuffleAndFlatten = (a: SongList | SongList[], shuffle: boolean = true): SongList => {
    if (a.length === 0) return a as SongList;
    if (shuffle) {
      a = arrayShuffle(a);
      a = arrayShuffle(a);
      a = arrayShuffle(a);
      a = arrayShuffle(a);
      a = arrayShuffle(a);      
    }
    a = a.flat();
    return a;
  }

  bookmarkQueueRuleToComment = (queueRule: BookmarkQueueRule) : string => {
    return JSON.stringify({ ...queueRule, bookmarkSource: 'SubFire' } || '');
  }

  constructFakeObject = (type: string, id: string): Partial<Generic> => {
    const rv = {
      id: id,
      coverArt: "-1",
      title: ""
    }
    switch (type) {
      case 'playlist':
      case 'station':
      case 'radiostation':
        rv.coverArt = "pl-" + id;
        break;
      case 'albumID3':
      case 'albumAction':
        rv.coverArt = "al-" + id;
        break;
      case 'artist':
      case 'artistAction':
        rv.coverArt = "ar-" + id;
        break;
      case 'album':
      case 'directory':
      case 'directoryAction':
        rv.coverArt = id;
    }
    return rv;
  }

  // for bookmark and loader rendering
  getObject = (type: string, id: string | number): Promise<any> => {
    switch (type) {
      case 'playlist':
      case 'station':
      case 'radiostation':
        const p = SubsonicCache.Playlists[id as string];
        return Promise.resolve(p);
      case 'albumID3':
      case 'albumAction':
        return this.getAlbum(id as string);
      case 'artist':
      case 'artistAction':
        return this.getArtist(id as string);
      case 'album':
        return this.getAlbum(id as string);
      case 'directory':
      case 'directoryAction':
        return this.getMusicDirectory(id as string);
      case 'folderShuffle':
        const mf =
          id === -1 ? { name: 'All Music Folders', id: -1 } : SubsonicCache.MusicFolders.find(x => x.id + '' === id + '');
        return Promise.resolve(mf);
      case 'playQueue':
        return Promise.resolve({ name: 'Play Queue', id: -1 });
      case 'podcasts':
        return Promise.resolve({ name: 'Podcasts', id: -1 });
      case 'song':
        return this.getSong(id as string);
      default:
        return Promise.resolve({
          name: 'Unsupported Type',
          id: -1
        });
    }
  }

  [key: string]: any
};
export const Subsonic = new SubsonicClass();
(window as any)['fetcher'] = Subsonic;

export interface SubsonicSongLoader {
  (a?: any, b?: any, c?: any, d?: any): Promise<SongList>
}

export default {
  Subsonic,
  SubsonicClass
}
