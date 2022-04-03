import { Subsonic } from './Subsonic';
import { SongList, SubfireStation, Playlist, CategorizedPlaylists } from './SubsonicTypes';
import { getRandomIntInclusive, arrayShuffle, arrayRemove, format as f } from './utils/utils';

interface GeneratorParams {
  g?: string
  fy?: number
  ty?: number
  id?: string | number
  c?: number
  d?: number
  n?: string
  w?: number
  l?: number
}

interface GeneratorObject {
  title?: string
  name?: string
  id?: string
}

interface Generator {
  p: GeneratorParams
  o?: GeneratorObject
  gtm: GeneratorType
  t: string
  w?: number
  l?: number
}

interface GeneratorRenderMethod {
  (g: Generator): string
}

interface GeneratorType {
  title: string
  op: string
  paramTitles: string[]
  paramKeys: string[]
  fetchMethod?: string
  render: GeneratorRenderMethod
}

interface StationData {
  radiostation: {
    o: {
      m?: number | string // max
      t?: string // tag
      b?: number | string // block
    }
    g: Generator[]
  }
}

interface SongListBucket {
  songs: SongList,
  g: Generator
}

type KeySongs = {
  [key: string]: SongList
}

export const GeneratorTypeMap = {} as { [key: string]: GeneratorType };

GeneratorTypeMap.rs = {
  title: 'Random Songs',
  op: 'getRandomSongs',
  // these MUST match the order of the function call in the Subsonic
  paramTitles: ['Genre', 'From Year', 'To Year', 'Music Folder'],
  paramKeys: ['g', 'fy', 'ty', 'id'],
  // shouldn't need to be called
  fetchMethod: 'getMusicFolder',
  render: function (g: Generator): string {
    let rv = 'Random Songs';
    if (g.p.g) rv += ' with ' + this.paramTitles[0] + ' ' + g.p.g;
    if (g.p.fy) rv += ' ' + this.paramTitles[1] + ' ' + g.p.fy;
    if (g.p.ty) rv += ' ' + this.paramTitles[2] + ' ' + g.p.ty;
    if (g.p.id) rv += ' in ' + this.paramTitles[3] + ' ' + (g.o?.title || g.o?.name || g.p.id);
    return rv;
  }
};
GeneratorTypeMap.pl = {
  title: 'Playlist',
  op: 'getPlaylist',
  paramTitles: ['Playlist'],
  paramKeys: ['id'],
  render: function (g: Generator): string {
    return f('Songs from {0} {1}', this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
};
GeneratorTypeMap.al = {
  title: 'Album',
  op: 'getAlbum',
  paramTitles: ['Album'],
  paramKeys: ['id'],
  fetchMethod: 'getAlbum',
  render: function (g: Generator): string {
    return f('Songs from {0} {1}', this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
};
GeneratorTypeMap.alc = {
  title: 'Complete Album',
  op: 'getCompleteAlbum',
  paramTitles: ['Album'],
  paramKeys: ['id'],
  fetchMethod: 'getAlbum',
  render: function (g: Generator): string {
    return f('Complete {0} {1}', this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
};
GeneratorTypeMap.ss = {
  title: 'Similar Songs',
  op: 'getSimilarSongs2',
  paramTitles: ['Artist'],
  paramKeys: ['id'],
  fetchMethod: 'getArtist',
  render: function (g: Generator): string {
    return f('{0} to {1} {2}', this.title, this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
}
GeneratorTypeMap.ts = {
  title: 'Top Songs',
  op: 'getTopArtistSongs',
  paramTitles: ['Artist'],
  paramKeys: ['id'],
  render: function (g: Generator): string {
    return f('{0} of {1} {2}', this.title, this.paramTitles[0], g.o?.title || g.o?.name || g.p.n);
  }
}
// more complex recursive generators
GeneratorTypeMap.tsa = {
  title: 'Top Related Songs',
  op: 'getTopSimilarSongs',
  paramTitles: ['Artist', 'Count', 'Depth'],
  paramKeys: ['id', 'c', 'd'],
  fetchMethod: 'getArtist',
  render: function (g: Generator): string {
    return f('{0} of {1} {2}, {3}: {4}, {5}: {6}',
      this.title,
      this.paramTitles[0],
      g.o?.title || g.o?.name || g.p.id,
      this.paramTitles[1],
      g.p.c || 10,
      this.paramTitles[2],
      g.p.d || 2
    );
  }
}
GeneratorTypeMap.ar = {
  title: 'Artist Songs',
  op: 'getArtistSongs',
  paramTitles: ['Artist'],
  paramKeys: ['id'],
  fetchMethod: 'getArtist',
  render: function (g: Generator): string {
    return f('All Songs of {1} {2}', this.title, this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
}
GeneratorTypeMap.arl = {
  title: 'Artist Albums',
  op: 'getArtistAlbums',
  paramTitles: ['Artist'],
  paramKeys: ['id'],
  fetchMethod: 'getArtist',
  render: function (g: Generator): string {
    return f('All Albums of {1} {2}', this.title, this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
}
GeneratorTypeMap.md = {
  title: 'Music Directory Songs',
  op: 'getMusicDirectorySongs',
  paramTitles: ['Directory'],
  paramKeys: ['id'],
  fetchMethod: 'getMusicDirectory',
  render: function (g: Generator): string {
    return f('All Songs under {1} {2}', this.title, this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
}
GeneratorTypeMap.ma = {
  title: 'Music Directory Albums',
  op: 'getMusicDirectoryAlbums',
  paramTitles: ['Directory'],
  paramKeys: ['id'],
  fetchMethod: 'getMusicDirectory',
  render: function (g: Generator): string {
    return f('All Albums under {1} {2}', this.title, this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
}
GeneratorTypeMap.rt = {
  title: 'Radio Station Current Contents',
  op: 'getPlaylist',
  paramTitles: ['Station'],
  paramKeys: ['id'],
  render: function (g: Generator): string {
    return f('Fetch pre-loaded songs from {0} {1}', this.paramTitles[0], g.o?.title || g.o?.name || g.p.id);
  }
};

// these are used when doing the block party mode
const moreSongs = function (b: any) {
  for (let i = 0; i < b.length; ++i) {
    if (b[i].values.length) return true;
  }
  return false;
};

const grabSong = function (b: any) {
  const r = getRandomIntInclusive(0, 100);
  for (let i = 0; i < b.length; ++i) {
    if (b[i].match(r)) {
      const p = b[i].pluck();
      return p;
    }
  }
  return null;
};

export class Station implements SubfireStation {
  playlist: Playlist;
  stationData: StationData;
  constructor(playlist: Playlist) {
    if (!playlist) {
      playlist = {
        id: "-1",
        comment: JSON.stringify({
          radiostation: {
            g: [],
            o: {}
          }
        }),
        public: true,
        name: 'New Station',
        entry: []
      };
    }
    this.playlist = playlist;
    try {
      this.stationData = JSON.parse(playlist.comment || "false");
    } catch (e) {
      throw e;
    }
    if (!this.stationData) {
      throw new TypeError('Playlist is not a station');
    }
  }

  get name() {
    return this.playlist.name;
  }
  set name(n) {
    this.playlist.name = n;
  }

  get id() {
    return this.playlist.id;
  }
  set id(i) {
    this.playlist.id = i;
  }

  get coverArt() {
    return this.playlist.coverArt || this.playlist.id;
  }
  set coverArt(i) {
    this.playlist.coverArt = i;
  }

  get songCount() {
    return this.playlist.songCount;
  }
  set songCount(i) {
    this.playlist.songCount = i;
  }

  get owner() {
    return this.playlist.owner;
  }

  get public() {
    return this.playlist.public;
  }
  set public(b) {
    this.playlist.public = b;
  }

  get comment() {
    return this.playlist.comment;
  }
  set comment(s) {
    this.playlist.comment = s;
  }

  get o() {
    if (!this.stationData.radiostation.o) this.stationData.radiostation.o = {};
    return this.stationData.radiostation.o;
  }

  set max(m) {
    this.o.m = m;
  }
  get max() {
    return this.o.m;
  }
  set tag(m) {
    this.o.t = m;
  }
  get tag() {
    return this.o.t;
  }
  set block(m) {
    this.o.b = m;
  }
  get block() {
    return this.o.b;
  }

  async getGeneratorObject(g: Generator) {
    g.gtm = g.gtm || GeneratorTypeMap[g.t];
    const op = g.gtm.fetchMethod || g.gtm.op;
    const id = g.p.id;
    if (!id) return {};
    // cast away to get generics
    const s = Subsonic as any;
    const object = await s[op](id);
    g.o = object;
    return object;
  }

  addGenerator(type: string | any, params: GeneratorParams, w?: number, l?: number) {
    let g: Generator;
    if (typeof type === 'string') {
      g = {
        gtm: GeneratorTypeMap[type],
        t: type,
        p: params,
        w: w,
        l: l
      };
    } else {
      g = { ...type, gtm: GeneratorTypeMap[type.t] };
    }
    this.stationData.radiostation.g.push(g);
    return g;
  }

  removeGenerator = (g: Generator) => {
    arrayRemove(this.stationData.radiostation.g, g);
  }

  changeGeneratorId = (g: Generator, id: string | number, object: any) => {
    g.p.id = id;
    g.o = object || null;
    if (!object) {
      this.getGeneratorObject(g).then();
    }
  }

  generators = async (): Promise<Generator[]> => {
    for (const g of this.stationData.radiostation.g) {
      g.o = await this.getGeneratorObject(g);
    }
    return this.stationData.radiostation.g;
  }

  // internal cache only
  get generatorArray() {
    return this.stationData.radiostation.g;
  }

  renderWeightLimit = (g: Generator) => {
    let rv = '';
    if (g.p.l || g.p.w) rv += ' ( ';
    if (g.p.l) rv += 'limit: ' + g.p.l;
    if (g.p.l && g.p.w) rv += ', ';
    if (g.p.w) rv += 'weight: ' + g.p.w;
    if (g.p.l || g.p.w) rv += ' )';
    return rv;
  }

  renderStation = (): string => {
    let s = '';
    s += this.name;
    s += ' ';
    s += this.id;
    s += ' ';
    s += this.generatorArray.map(g => this.render(g)).join(' ');
    return s;
  }

  render = (g: Generator): string => {
    if (!g.gtm) g.gtm = GeneratorTypeMap[g.t];
    return g.gtm.render(g) + this.renderWeightLimit(g);
  }

  getSongs(res: any): SongList {
    if (Array.isArray(res)) return res;
    if (res.entry && Array.isArray(res.entry)) return res.entry;
    if (res.entry && !Array.isArray(res.entry)) return [res.entry];
    if (res.song && Array.isArray(res.song)) return res.song;
    if (res.song && !Array.isArray(res.song)) return [res.song];
    if (res.playlist) return res.playlist.entry || [];
    if (res.randomSongs) return res.randomSongs.song || [];
    if (res.topSongs) return res.topSongs.song || [];
    if (res.similarSongs) return res.similarSongs.song || [];
    if (res.similarSongs2) return res.similarSongs2.song || [];
    if (res.albumCollection) return res.albumCollection.song || res.albumCollection.albums || [];
    if (res.album) return res.album.song || [];
    if (res.musicDirectory) return res.musicDirectory.song || [];
    if (res.musicDirectoryAlbums) return res.musicDirectoryAlbums.album || [];
    return [];
  }

  generate = async (g: Generator, forBucket: boolean): Promise<SongList | SongListBucket> => {
    const gtm = g.gtm;
    const params = [];
    for (let i = 0; i < gtm.paramKeys.length; ++i) {
      const p = g.p as any;
      params[i] = p[gtm.paramKeys[i]];
    }
    if ((gtm.op === 'getRandomSongs' || gtm.op === 'getSimilarSongs2') && g.p.l) {
      params[gtm.paramKeys.length] = g.p.l;
    }
    const s = Subsonic as any;
    const res = await s[gtm.op].apply(Subsonic, params);
    const songs = this.getSongs(res);
    if (forBucket) {
      return {
        songs,
        g
      };
    }
    return songs;
  }

  generateAllAndSave = async () => {
    const songs = await this.generateAll();
    const songIds = songs.map(c => c.id);
    const { id, name, comment } = this.playlist;
    const shared = this.playlist.public;
    let pl = await Subsonic.createPlaylist(name, id || null);
    if (pl) {
      await Subsonic.updatePlaylist(pl.id, comment || '', shared, name, songIds, []);
    }
  }

  generateAll = async (): Promise<SongList> => {
    const gs = await this.generators();
    const values = [];
    for (let g of gs) {
      const nextValues = await this.generate(g, true) as SongListBucket;
      Array.from({ length: 5 }, () => arrayShuffle(nextValues.songs));
      let limit = g.p.l || 0;
      if (limit) {
        nextValues.songs = nextValues.songs.slice(0, limit);
      }
      values.push(nextValues);
    }
    let buckets: any[] = [],
      rest: any[] = [],
      nextStart = 0;
    for (const v of values) {
      let weight = v.g.p.w;
      if (weight) {
        buckets.push({
          name: 'whocares', // g.name,
          weight: weight,
          min: nextStart,
          max: nextStart + weight,
          values: v.songs,
          count: 0,
          /*jshint -W083 */
          match: function (r: number) {
            //console.log(this.name, "do i match", this.min, r, this.max, this.min <= r && r < this.max);
            return this.min <= r && r < this.max;
          },
          pluck: function () {
            this.count++;
            return this.values.length ? this.values.shift() : null;
          }
        });
        nextStart += weight;
      } else {
        rest = rest.concat(v.songs);
      }
    }
    Array.from({ length: 5 }, () => arrayShuffle(rest));
    rest = {
      name: 'rest',
      min: nextStart,
      max: 100.01,
      weight: 'the rest',
      values: rest,
      count: 0,
      /*jshint -W083 */
      match: function (r: number) {
        //console.log(this.name, "do i match", this.min, r, this.max, this.min <= r && r < this.max);
        return this.min <= r && r < this.max;
      },
      pluck: function () {
        this.count++;
        return this.values.length ? this.values.shift() : null;
      }
    } as any;
    buckets.push(rest);

    let songs: any[] = [];
    let i = 0;
    while (moreSongs(buckets) && songs.length < 2000 && i < 10000) {
      const s = grabSong(buckets);
      if (s) songs.push(s);
      i++;
    }
    if (buckets.length === 1) {
      Array.from({ length: 5 }, () => arrayShuffle(songs));
    }
    let block = parseInt(this.block + "", 10);
    if (!block || isNaN(block)) block = 0;
    if (block) {
      songs = this.blockParty(songs, block);
    }

    let max = parseInt(this.max + "", 10);
    if (!max || isNaN(max)) max = 900;

    songs = songs.flat(1000).slice(0, max);

    return songs;
  }

  // block party mode

  blockParty(songs: SongList, block: number) {
    const keySongs: KeySongs = {};
    let keys: Array<string> = [];
    const newSongs: SongList = [];
    songs.forEach(function (s: any) {
      const s1 = Array.isArray(s) ? s[0] : s;
      //console.log(s, s1);
      let a = s1.artistId;
      if (!a) a = 'no-artist';
      //console.log(a);
      if (!keySongs[a]) {
        keySongs[a] = [];
        keys.push(a);
      }
      keySongs[a].push(s);
    });

    const pluckSongs = (a: string) => {
      const sl = keySongs[a];
      for (let i = 0; i < block; ++i) {
        if (sl.length === 0) break;
        newSongs.push(sl.shift());
      }
    }

    do {
      // shuffle the keys
      keys = arrayShuffle(keys);
      // and pluck a 'block' of songs out
      keys.forEach(pluckSongs);
    } while (songs.length > newSongs.length);

    return newSongs;
  }

  saveStation = async (): Promise<Station | null> => {
    const station = this;
    // copy the data
    const sd = { ...station.stationData };
    // now trim down the excess
    const rs = sd.radiostation;
    rs.g = rs.g.map(g => ({ t: g.t, p: g.p, l: g.l, w: g.w } as Generator));
    // safety-check incomplete parameters to avoid a blow-up in current radio mode.
    rs.o = rs.o || {};
    rs.o.t = rs.o.t || '';
    rs.o.m = rs.o.m || '';
    rs.o.b = rs.o.b || '';

    station.comment = JSON.stringify(sd);
    console.log(station.id, station.comment, station.public, station.name);
    let pl;
    if (!station.id) {
      pl = await Subsonic.createPlaylist(station.name);
    } else {
      pl = station;
    }
    if (!pl) return null;
    pl = await Subsonic.updatePlaylist(
      pl.id,
      station.comment,
      station.public === undefined ? true : station.public,
      station.name
    );
    return new Station(pl);
  }

  // async deleteStation(station) {
  //   return Subsonic.deletePlaylist(station.id);
  // }
}

export const createStations = function (pls: CategorizedPlaylists) {
  pls.stations = (pls.stationPlaylists || []).map(pl => new Station(pl));
  return pls;
};

