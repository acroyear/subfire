import React from "react";
// import {useLocalStorage} from 'react-use';

import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";

const QUERIES = [
  {
    id: "random",
    name: "Random",
  },
  {
    id: "newest",
    name: "Recently Added",
  },
  {
    id: "recent",
    name: "Recently Played",
  },
  {
    id: "frequent",
    name: "Most Played",
  },
  {
    id: "alphabeticalByName",
    name: "By Album Name",
  },
  {
    id: "alphabeticalByArtist",
    name: "By Artist Name",
  },
  {
    id: "starred",
    name: "Starred",
  },
  {
    id: "byYear",
    name: "Oldest First",
  },
  {
    id: "byYear reversed",
    name: "Newest First",
  },
];

export const AlbumQueryChooser = (props) => {
  const {
    native,
    albumQuery,
    setAlbumQuery,
    albumID3,
    setAlbumID3,
    musicFolderChooser,
    gridListToggle,
  } = props;

  // const [plID, setPlID] = useLocalStorage('initAlbumPL', null);
  // const queries = [...QUERIES, { id: 'pl-' + plID, value: 'From Playlist'}];
  const queries = QUERIES;

  const handleChange = (evt) => {
    setAlbumQuery(evt.target.value);
  };

  const handleID3Change = (evt, isInputChecked) => {
    setAlbumID3(isInputChecked);
  };

  // const handlePlaylistChange = newPL => {
  //   setPlID(newPL); // update pl which updates queries
  //   setAlbumQuery('pl-' + plID); // then update query`
  // };

  const queryItems = queries.map((m) => {
    if (native)
      return (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      );
    return (
      <MenuItem key={m.id} value={m.id}>
        {m.name}
      </MenuItem>
    );
  });

  let value = albumQuery;
  const id3 = albumID3 || false;
  const label = "ID3?";

  const plMode = value.startsWith("pl-");
  let plSelect = null;
  if (plMode) {
    // const currentPlaylistId = value.substring(3);
    // plSelect = (
    //   <Grid item={true} xs={6} md={3}>
    //     <FormControl fullWidth={true}>
    //       <InputLabel htmlFor="pl-select">Playlist</InputLabel>
    //       <PlaylistsBrowser
    //         native={native}
    //         subsonic={props}
    //         SubsonicSource={SubsonicSource}
    //         renderMode={PlaylistsBrowser.renderTypes.SELECT}
    //         selectedId={currentPlaylistId}
    //         onSelect={handlePlaylistChange}
    //         showThumbs={false}
    //       />
    //     </FormControl>
    //   </Grid>
    // );
    plSelect = "not implemented yet";
  }

  const id3Selector = (
    <Grid item={true} xs={3} md={1}>
      <FormControlLabel
        control={
          <Switch
            label={label}
            value="id3"
            checked={id3}
            onChange={handleID3Change}
          />
        }
        label="ID3"
      />
    </Grid>
  );

  const albumQuerySelector = (
    <Grid item={true} xs={plMode ? 5 : 12} md={plMode ? 3 : 6}>
      <FormControl fullWidth={true}>
        <InputLabel htmlFor="album-query-select">Sorted By...</InputLabel>
        <Select
          native={native}
          value={value}
          onChange={handleChange}
          input={<Input name="album-query" id="album-query-select" />}
        >
          {queryItems}
        </Select>
      </FormControl>
    </Grid>
  );

  // grid-list-toggle is passed down, album chooser sets and stores it like artist action buttons
  const gridListToggleSection = (
    <Grid item xs={4} md={2}>
      {gridListToggle}
    </Grid>
  );

  const musicFolderChooserSection = (
    <Grid item xs={5} md={3}>
      {musicFolderChooser}
    </Grid>
  );

  const content =
    window.innerWidth >= 960 ? (
      <Grid container>
        {musicFolderChooserSection}
        {albumQuerySelector}
        {plSelect}
        {id3Selector}
        {gridListToggleSection}
      </Grid>
    ) : (
      <Grid container>
        {musicFolderChooserSection}
        {id3Selector}
        {gridListToggleSection}
        {albumQuerySelector}
        {plSelect}
      </Grid>
    );
  return content;
};

export default AlbumQueryChooser;
