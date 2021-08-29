
export interface MusicFolder {
  id: number;
  name: string;
}

export type MusicFolders = MusicFolder[] | null;

export interface Song {
  id: string;
  parent: string;
  isDir?: boolean;
  title: string;
  album: string;
  artist: string;
  track: number;
  year: number;
  genre: string;
  coverArt: string;
  size: number;
  contentType: string;
  suffix: string;
  duration: number;
  bitRate: number;
  path: string;
  playCount: number;
  discNumber: number;
  created: string;
  albumId: string;
  artistId: string;
  type: string;
  bookmarkPosition?: number;
  name?: string // ignore me
  [key: string]: string | number | boolean
}

export class Bookmark {
  position: number;
  username: string;
  comment: string;
  created: string;
  changed: string;
  entry: Song;

  get id() {return this.entry.id;}
  get title() { return this.entry.title; }
}

export type Bookmarks = Bookmark[];

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverArt: string;
  songCount: number;
  duration: number;
  playCount: number;
  created: string;
  year: number;
  genre: string;
  song: Song[];
  title?: string; // ignore me
}

export interface Artist {
  id: string;
  name: string;
  coverArt: string;
  albumCount: number;
  album?: Album[];
  starred?: string;
  title?: string; // ignore me
}

export interface ArtistsIndex {
  name: string;
  artist: Artist[];
}

export interface ArtistIndexes {
  ignoredArticles: string;
  index: ArtistsIndex[];
}

export interface MusicDirectory {
  id: string;
  name: string;
  child?: (MusicDirectory | Song)[];
  starred?: string;
  isDir?: boolean;
  title?: string;
  album?: string;
  artist?: string;
  year?: number;
  genre?: string;
  coverArt?: string;
  playCount?: number;
  created?: string;
}

export interface MusicDirectoryIndex {
  name: string;
  artist: MusicDirectory[];
}

export interface MusicDirectoryIndexes {
  lastModified: number;
  ignoredArticles: string;
  index: MusicDirectoryIndex[];
}

export type AlbumListType = Album | MusicDirectory;

export interface Podcasts {
  channel?: (Channel)[] | null;
}

export interface Channel {
  id: string;
  url: string;
  title: string;
  description: string;
  coverArt: string;
  originalImageUrl: string;
  status: string;
  episode?: (PodcastEpisode)[] | null;
}

export interface PodcastEpisode {
  id: string;
  parent?: string | null;
  isDir: boolean;
  title: string;
  album?: string | null;
  artist?: string | null;
  coverArt?: string | null;
  size?: number | null;
  contentType?: string | null;
  suffix?: string | null;
  transcodedContentType?: string | null;
  transcodedSuffix?: string | null;
  duration?: number | null;
  bitRate?: number | null;
  playCount?: number | null;
  created?: string | null;
  type?: string | null;
  streamId?: string | null;
  channelId: string;
  description?: string | null;
  status: string;
  publishDate: string;
  year?: number | null;
  genre?: string | null;
  track?: number | null;
  discNumber?: number | null;
  artistId?: string | null;
  name?: string; // ignore me
}

export interface PlayQueue {
  current: number;
  position: number;
  username?: string;
  changed?: string;
  changedBy?: string;
  entry?: (Song)[];
}

export interface NowPlayingEntry extends Song {
  username: string;
  minutesAgo: number;
  playerId: number;
  playerName: string;
}

export interface NowPlaying {
  entry?: (NowPlayingEntry)[] | null;
}

export interface SearchResult {
  song?: (Song)[] | null;
  albumDirectories?: (MusicDirectory)[] | null;
  artistDirectories?: (MusicDirectory)[] | null;
  album?: (Album)[] | null;
  artist?: (Artist)[] | null;
}

export interface SearchResult2 {
  song?: (Song)[] | null;
  album?: (MusicDirectory)[] | null;
  artist?: (MusicDirectory)[] | null;
}

export interface SearchResult3 {
  song?: (Song)[] | null;
  album?: (Album)[] | null;
  artist?: (Artist)[] | null;
}

export interface Playlist {
  id: string;
  name: string;
  owner?: string;
  public: boolean;
  songCount?: number;
  duration?: number;
  comment?: string;
  created?: string;
  changed?: string;
  coverArt?: string;
  entry?: Song[];
  title?: string; // ignore me
}

export interface InternetRadioStation {
  id: string;
  name: string;
  streamUrl: string;
  homePageUrl: string;
}

export type Genres = Genre[] | null;

export interface Genre {
  songCount: number;
  albumCount: number;
  value: string;
}

export interface SearchCriteria {
  query: string,
  musicFolderId?: number,
  artistCount?: number,
  artistOffset?: number,
  albumCount?: number,
  albumOffset?: number,
  songCount?: number,
  songOffset?: number
}

export type AlbumListCriteriaType = 'random' | 'newest' | 'highest' | 'frequent' | 'recent' | 'alphabeticalByName' | 'alphabeticalByArtist' | 'starred' | 'byYear' | 'byYear reversed' | 'byGenre';

export interface AlbumListCriteria {
  type: AlbumListCriteriaType,
  size?: number,
  offset?: number,
  fromYear?: number,
  toYear?: number,
  genre?: string,
  musicFolderId?: number
}

export interface ChatMessages {
  chatMessage?: (ChatMessageEntity)[] | null;
}

export interface ChatMessageEntity {
  username: string;
  time: number;
  message: string;
}

export interface ArtistInfo {
  biography: string;
  musicBrainzId: string;
  lastFmUrl: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
  similarArtist?: (Artist | MusicDirectory)[] | null;
}

/* everything below here is for Radio Generation */

export type PlaylistsType = 'allPlaylists' | 'playlists' | 'stationPlaylists' | 'receivers' | 'myPlaylists';

export interface CategorizedPlaylists {
  allPlaylists: Playlist[]
  playlists: Playlist[]
  stationPlaylists: Playlist[]
  receivers: Playlist[]
  myPlaylists: Playlist[]
  stations?: SubfireStation[]
  [key: string]: Playlist[] | SubfireStation[]
}

export interface CompleteAlbum {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverArt: string;
  songCount: number;
  duration: number;
  playCount: number;
  created: string;
  year: number;
  genre: string;
  song: Song[][];
}

export interface SubfireStation {
  generate: any
  generateAll: any
  generateAllAndSave: any
}

export type Generic = Song | Album | Artist | Playlist | MusicDirectory | PodcastEpisode;
