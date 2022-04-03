import React from "react";
import ReactDOM from "react-dom";

import {
  Subsonic,
  SubsonicCache,
  createStations,
} from "@subfire/core";
console.log(Subsonic);

export default {
  title: "api/API",
};

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook",
};

export const basic = () => {
  async function f() {
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    console.log(credentials);
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    const res = await p;
    const {
      allPlaylists,
      playlists,
      stations,
      stationPlaylists,
      receivers,
    } = await Subsonic.getPlaylists()
      .then(Subsonic.categorizePlaylists)
      .then(createStations);
    console.log(
      allPlaylists.length,
      "pl",
      playlists.length,
      "stations",
      stations.length,
      "stationPlaylists",
      stationPlaylists.length,
      "receivers",
      receivers.length
    );

    const s = stations[20];
    (async () => {
      const gs = await s.generators();
      document.querySelector("#station-data").innerText = s.renderStation();
    })();

    const newContent = (
      <>
        <span>Check the console logs, dude.</span>
        <hr />
        <span id="station-data">{s.renderStation()}</span>
        <hr />
        <span>{JSON.stringify(receivers)}</span>
        <hr />
        <span>{JSON.stringify(playlists)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("basic-id"));
  }
  f().catch((err) => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("basic-id"));
  });

  return <div id="basic-id">Loading...</div>;
};

export const ArtistAlbum = (props) => {
  async function f() {
    const id = "517";
    console.warn("init");
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    const res = await p;
    const res2 = await Subsonic.getArtists();
    const newContent = (
      <>
        <span>Before asking for albums</span>
        <span>{JSON.stringify(SubsonicCache.ArtistsById[id])}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("aa0-id"));
    const a = await Subsonic.getArtist(id);
    const newContent2 = (
      <>
        <span>After asking for albums</span>
        <span>{JSON.stringify(a)}</span>
      </>
    );
    ReactDOM.render(newContent2, document.getElementById("aa1-id"));
    setTimeout(() => {
      Subsonic.getArtist(id).then((a2) => {
        const newContent = (
          <>
            <span>After asking for albums - cache</span>
            <span>{JSON.stringify(a2)}</span>
          </>
        );
        ReactDOM.render(newContent, document.getElementById("aa2-id"));
      });
    }, 5000);
  }
  f().catch((err) => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("aa1-id"));
  });
  return (
    <>
      <div id="aa0-id">Loading before individual query...</div>
      <hr />
      <div id="aa1-id">Loading...</div>
      <hr />
      <div id="aa2-id">Loading...</div>
    </>
  );
};

export const Album = (props) => {
  async function f() {
    const id = "1517";
    console.warn("init");
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    const res = await p;
    const a = await Subsonic.getAlbum(id);
    const newContent = (
      <>
        <span>{JSON.stringify(a)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("aa1-id"));
    setTimeout(() => {
      Subsonic.getAlbum(id).then((a2) => {
        const newContent = (
          <>
            <span>{JSON.stringify(a2)}</span>
          </>
        );
        ReactDOM.render(newContent, document.getElementById("aa2-id"));
      });
    }, 5000);
  }
  f().catch((err) => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("aa1-id"));
  });
  return (
    <>
      <div id="aa1-id">Loading...</div>
      <hr />
      <div id="aa2-id">Loading...</div>
    </>
  );
};

export const MusicDirectory = (props) => {
  async function f() {
    const id = "33245";
    console.warn("init");
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    const res = await p;
    console.warn("asking 3 copies right away");
    Subsonic.getMusicDirectory(id).then(
      (res) => (document.getElementById("md-1").innerText = res.name)
    );
    Subsonic.getMusicDirectory(id).then(
      (res) => (document.getElementById("md-2").innerText = res.name)
    );
    Subsonic.getMusicDirectory(id).then(
      (res) => (document.getElementById("md-3").innerText = res.name)
    );
    console.warn("delay 4 barely");
    setTimeout(() => {
      Subsonic.getMusicDirectory(id).then(
        (res) => (document.getElementById("md-4").innerText = res.name)
      );
    }, 10);
    console.warn("delay 5 quite a bit");
    setTimeout(() => {
      Subsonic.getMusicDirectory(id).then(
        (res) => (document.getElementById("md-5").innerText = res.name)
      );
    }, 3000);
  }
  f().catch((err) => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("wrapper-id"));
  });
  return (
    <div id="wrapper-id">
      <ul>
        <li id="md-1"></li>
        <li id="md-2"></li>
        <li id="md-3"></li>
        <li id="md-4"></li>
        <li id="md-5"></li>
      </ul>
    </div>
  );
};

export const Playlist = (props) => {
  async function f() {
    const id = "5";
    console.warn("init");
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    const res = await p;
    console.warn("asking 3 copies right away");
    Subsonic.getPlaylist(id, true).then(
      (res) => (document.getElementById("md-1").innerText = res.name)
    );
    Subsonic.getPlaylist(id, true).then(
      (res) => (document.getElementById("md-2").innerText = res.name)
    );
    Subsonic.getPlaylist(id, true).then(
      (res) => (document.getElementById("md-3").innerText = res.name)
    );
    console.warn("delay 4 barely");
    setTimeout(() => {
      Subsonic.getPlaylist(id, true).then(
        (res) => (document.getElementById("md-4").innerText = res.name)
      );
    }, 10);
    console.warn("delay 5 quite a bit");
    setTimeout(() => {
      Subsonic.getPlaylist(id, true).then(
        (res) => (document.getElementById("md-5").innerText = res.name)
      );
    }, 3000);
    console.warn("delay 6 quite a bit and no cache!");
    setTimeout(() => {
      Subsonic.getPlaylist(id).then(
        (res) => (document.getElementById("md-6").innerText = res.name)
      );
    }, 15000);
        console.warn("delay 7 same time but but from cache");
        setTimeout(() => {
          Subsonic.getPlaylist(id, true).then(
            (res) => (document.getElementById("md-7").innerText = res.name)
          );
        }, 15000);
  }
  f().catch((err) => {
    console.error(err);
    const newContent = (
      <>
        <span>oops? Check the console logs, dude.</span>
        <br />
        <span>{JSON.stringify(err)}</span>
      </>
    );
    ReactDOM.render(newContent, document.getElementById("wrapper-id"));
  });
  return (
    <div id="wrapper-id">
      <ul>
        <li>instant and cache
          <span id="md-1" />
        </li>
        <li>instant and cache
          <span id="md-2" />
        </li>
        <li>instant and cache
          <span id="md-3" />
        </li>
        <li>very slight delay and cache
          <span id="md-4" />
        </li>
        <li>delay and cache
          <span id="md-5" />
        </li>
        <li>delay and no cache, so always fetch
          <span id="md-6" />
        </li>
        <li>delay but from cache
          <span id="md-7" />
        </li>
      </ul>
    </div>
  );
};
