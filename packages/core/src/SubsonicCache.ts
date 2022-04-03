import { Album, Artist, ArtistsIndex, Bookmark, Channel, Genres, MusicDirectory, MusicDirectoryIndex, MusicFolders, Playlist } from "./SubsonicTypes";

export const SubsonicCache = {
  MusicFolders: [] as MusicFolders,

  // map of id to indexes as string of the number, cached as you go, -1 for all
  MusicDirectoryIndexes: {} as { [key: number]: MusicDirectoryIndex[] },

  MusicPaths: {} as { [key: string]: MusicDirectory }, // full path for id

  // map of id to indexes as string of the number, cached as you go, -1 for all
  ArtistIndexes: {} as { [key: number]: ArtistsIndex[] },

  ArtistsById: {} as { [key: string]: Artist },
  ArtistsByName: {} as { [key: string]: Artist },
  ArtistNames: [] as string[],

  Albums: {} as { [key: string]: Album },

  // fetch on demand at the view layer but still cache
  ArtistInfoById: {} as { [key: string]: any },
  AlbumInfoById: {} as { [key: string]: any },

  Playlists: {} as { [key: string]: Playlist },

  Genres: [] as Genres,

  Podcasts: [] as Channel[],
  Bookmarks: [] as Bookmark[],

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

    this.Playlists = {};
  },
};
