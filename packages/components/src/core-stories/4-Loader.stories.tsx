import {
  Subsonic,
  SubsonicLoader,
  SubsonicCache,
  SubsonicTypes,
  createStations
} from "@subfire/core";
import { useEffect } from "react";

export default {
  title: "api/Loader",
};

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook",
};

let subfireStations: SubsonicTypes.SubfireStation[] = null;

export const loader_test = () => {
  function f() {
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    const s = Subsonic;

    s.open(server, username, password, bitrate, clientName)
      .then(s.getMusicFolders)
      .then(res => -1)
      .then(s.getIndexes)
      .then(res => -1)
      .then(s.getArtists)
      .then(res => { })
      .then(s.getGenres)
      .then(res => { })
      .then(s.getPlaylists)
      .then(s.categorizePlaylists)
      .then(createStations)
      .then(({
        allPlaylists,
        playlists,
        stations,
        stationPlaylists,
        receivers,
      }) => {
        subfireStations = stations;
        document.getElementById('result').innerText = 'ready';
      }).catch(e => {
        console.error(e);
        document.getElementById('result').innerText = e.toString();
      })
  }
  useEffect(() => {
    f();
  }, [])

  const apply = () => {
    const params = {
      type: (document.getElementById('loader_type') as HTMLInputElement).value,
      id: (document.getElementById('loader_id') as HTMLInputElement).value,
      mode: (document.getElementById('loader_mode') as HTMLInputElement).value,
      station: null as subfireStation
    };
    if (params.type === 'station' || params.type === 'radiostation') {
      params.station = subfireStations.find(x => x.id === params.id);
    }
    SubsonicLoader(params).then(sl => {
      console.log(sl);
      const s = JSON.stringify(sl, null, 2);
      document.getElementById('result').innerText = s;
    }).catch(e => {
      console.error(e);
      document.getElementById('result').innerText = e.toString();
      const sc = SubsonicCache;
      console.log(sc.ArtistsById[params.id]);
    });
  }

  return <>
    <p>
      type: <input id="loader_type"></input><br />
      id: <input id="loader_id"></input><br />
      mode: <input id="loader_mode"></input><br />
      <button onClick={apply}>Apply</button>
    </p>
    <hr />
    <pre id="result"></pre>
  </>
}
