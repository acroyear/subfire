import React from "react";
import ReactDOM from "react-dom";

import {
  Subsonic,
  SubsonicTypes,
  SubsonicCache,
  createStations,
  utils,
} from "@subfire/core";

const { sleep } = utils;

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook",
};

export default {
  title: "api/Playlists",
};

export const updatePlaylist = () => {
  async function f() {
    const {
      server,
      username,
      password,
      bitrate,
      clientName = "SubsonicStorybook",
    } = credentials;
    const p = Subsonic.open(server, username, password, bitrate, clientName);
    let res = await p;

    const random = await Subsonic.getRandomSongs(null, null, null, null, 225);
    const songsToAdd = random.randomSongs.song.map((s) => s.id);
    let pl = await Subsonic.createPlaylist("000 zzz demo demo demo");
    const id = pl.id;
    ReactDOM.render(
      <span>{JSON.stringify(pl)}</span>,
      document.getElementById("basic-id")
    );

    await sleep(2000);
    pl = await Subsonic.updatePlaylist(
      id,
      "update 1",
      true,
      "000 zzz demo demo demo updated",
      null,
      null
    );
    ReactDOM.render(
      <span>{JSON.stringify(pl)}</span>,
      document.getElementById("basic-id")
    );

    await sleep(2000);
    pl = await Subsonic.updatePlaylist(
      id,
      "update 2",
      true,
      "000 zzz demo demo demo updated",
      songsToAdd,
      null
    );
    ReactDOM.render(
      <span>{JSON.stringify(pl)}</span>,
      document.getElementById("basic-id")
    );

    await sleep(3000);
    const indexesToRemove = [];
    for (let i = 0; i < 20; ++i) indexesToRemove.push(i);
    pl = await Subsonic.updatePlaylist(
      id,
      "update 3",
      true,
      "000 zzz demo demo demo updated",
      null,
      indexesToRemove
    );
    ReactDOM.render(
      <span>are we 20 fewer? {JSON.stringify(pl)}</span>,
      document.getElementById("basic-id")
    );

    await sleep(3000);
    // clear playlist by creating anew but with same id
    pl = await Subsonic.createPlaylist(pl.name, id);
    ReactDOM.render(
      <span>{JSON.stringify(pl)}</span>,
      document.getElementById("basic-id")
    );

    await sleep(4000);
    Subsonic.deletePlaylist(id);
    ReactDOM.render(
      <span>{JSON.stringify(res)}</span>,
      document.getElementById("basic-id")
    );
  }
  const doF = () => {
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
  };
  return (
    <>
      <button onClick={doF}>Run test</button>
      <div id="basic-id">Content will go here...</div>
    </>
  );
};
