import { SubsonicTypes } from '.';

export const SubsonicCache = {
  MusicFolders: [] as SubsonicTypes.MusicFolder[],

  // map of id to indexes as string of the number, cached as you go, -1 for all
  MusicDirectoryIndexes: {} as { [key: string]: SubsonicTypes.MusicDirectoryIndex },

  MusicPaths: {} as { [key: string]: SubsonicTypes.MusicDirectory }, // full path for id

  // map of id to indexes as string of the number, cached as you go, -1 for all
  ArtistIndexes: {} as { [key: string]: SubsonicTypes.ArtistsIndex },

  ArtistsById: {} as { [key: string]: SubsonicTypes.Artist },
  ArtistsByName: {} as { [key: string]: SubsonicTypes.Artist },
  ArtistNames: [] as string[],

  Albums: {} as { [key: string]: SubsonicTypes.Album },

  // fetch on demand at the view layer but still cache
  ArtistInfoById: {} as { [key: string]: any },
  AlbumInfoById: {} as { [key: string]: any },

  Playlists: [] as SubsonicTypes.Playlist[],
  NormalPlaylists: [] as SubsonicTypes.Playlist[],
  Stations: [] as SubsonicTypes.Playlist[], // this may change

  Genres: [] as SubsonicTypes.Genre[],

  Podcasts: [] as SubsonicTypes.Channel[],
  Bookmarks: [] as SubsonicTypes.Bookmark[],

  reset: function () {
    // just an array of them, unsorted (view can sort)
    this.MusicFolders = [];

    // map of id to indexes as string of the number, cached as you go, -1 for all
    this.MusicDirectoryIndexes = {};

    this.MusicPaths = {}; // full path for id

    // map of id to indexes as string of the number, cached as you go, -1 for all
    this.ArtistIndexes = {};

    this.ArtistsById = {};
    this.ArtistsByName = {};
    this.ArtistNames = [];

    this.Albums = {};

    // fetch on demand at the view layer but still cache
    this.ArtistInfoById = {};
    this.AlbumInfoById = {};

    // only used for radio and other things to get the names. use context for everything else.
    this.Playlists = [];

    this.Genres = [];

    this.Podcasts = [];
  },
};

export default SubsonicCache;
