import { useState, useEffect, useRef } from "react";

import {
  Subsonic,
  SubsonicTypes,
  HtmlMedia,
  PlayerState
} from "@subfire/core";
type Song = SubsonicTypes.Song;

console.log(Subsonic);

export default {
  title: "api/HtmlMedia",
};

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook",
};

const initQueue: Song[] = [{ "id": "22766", "parent": "22730", "isDir": false, "title": "Between You And Me", "album": "Anoraknophobia", "artist": "Marillion", "track": 1, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 9311072, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 387, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-01 Between You And Me.mp3", "playCount": 4, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music", "coverArtURL": "https://rockpop.aboutjws.info/rest/getCoverArt.view?id=22766&size=400&v=1.15.0&f=json&c=SubFireMobile2&u=subfire&s=pawxmxpz&t=45526ec29dfbb807679fe2cbfb54a712", "src": "https://rockpop.aboutjws.info/rest/stream.view?id=22766&maxBitRate=0&v=1.15.0&f=json&c=SubFireMobile2&u=subfire&s=jintft&t=265a7242b4e201f8236304f81f5802b1" }, { "id": "22767", "parent": "22730", "isDir": false, "title": "Quartz", "album": "Anoraknophobia", "artist": "Marillion", "track": 2, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 13129118, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 546, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-02 Quartz.mp3", "playCount": 0, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music", "coverArtURL": "https://rockpop.aboutjws.info/rest/getCoverArt.view?id=22767&size=642&v=1.15.0&f=json&c=SubFireBase&u=subfire&s=ljctxhji&t=7ce0a633e0357c950f712a65e8576d9e", "src": "https://rockpop.aboutjws.info/rest/stream.view?id=22767&maxBitRate=0&v=1.15.0&f=json&c=SubFireMobile2&u=subfire&s=qbmwlu&t=ceb25019ff60b946242b6232db30adef" }, { "id": "22768", "parent": "22730", "isDir": false, "title": "Map Of The World", "album": "Anoraknophobia", "artist": "Marillion", "track": 3, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 7257796, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 302, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-03 Map Of The World.mp3", "playCount": 3, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22769", "parent": "22730", "isDir": false, "title": "When I Meet God", "album": "Anoraknophobia", "artist": "Marillion", "track": 4, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 13386798, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 557, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-04 When I Meet God.mp3", "playCount": 7, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22770", "parent": "22730", "isDir": false, "title": "The Fruit Of The Wild Rose", "album": "Anoraknophobia", "artist": "Marillion", "track": 5, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 10016387, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 417, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-05 The Fruit Of The Wild Rose.mp3", "playCount": 4, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22771", "parent": "22730", "isDir": false, "title": "Separated Out", "album": "Anoraknophobia", "artist": "Marillion", "track": 6, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 8963743, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 373, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-06 Separated Out.mp3", "playCount": 0, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22772", "parent": "22730", "isDir": false, "title": "This Is The 21st Century", "album": "Anoraknophobia", "artist": "Marillion", "track": 7, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 16014308, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 667, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-07 This Is The 21st Century.mp3", "playCount": 0, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22773", "parent": "22730", "isDir": false, "title": "If My Heart Were A Ball It Would Roll Uphill", "album": "Anoraknophobia", "artist": "Marillion", "track": 8, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 13638857, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 568, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-08 If My Heart Were A Ball It Woul.mp3", "playCount": 2, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22774", "parent": "22730", "isDir": false, "title": "Number One", "album": "Anoraknophobia", "artist": "Marillion", "track": 1, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 4049113, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 168, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-01 Number One.mp3", "playCount": 1, "discNumber": 2, "created": "2009-02-27T21:40:02.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22775", "parent": "22730", "isDir": false, "title": "Fruit Of The Wild Rose (Demo)", "album": "Anoraknophobia", "artist": "Marillion", "track": 2, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 9124202, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 380, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-02 Fruit Of The Wild Rose (Demo).mp3", "playCount": 0, "discNumber": 2, "created": "2009-02-27T21:41:24.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22776", "parent": "22730", "isDir": false, "title": "Separated Out (Demo)", "album": "Anoraknophobia", "artist": "Marillion", "track": 3, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 8732356, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 363, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-03 Separated Out (Demo).mp3", "playCount": 0, "discNumber": 2, "created": "2009-02-27T21:42:34.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22777", "parent": "22730", "isDir": false, "title": "Between You And Me (Mark Kelly Remix)", "album": "Anoraknophobia", "artist": "Marillion", "track": 4, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 7400755, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 308, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-04 Between You And Me (Mark Kelly.mp3", "playCount": 0, "discNumber": 2, "created": "2009-02-27T21:43:28.000Z", "albumId": "1914", "artistId": "636", "type": "music" }];

export const Player = (_props: any) => {
  const [idx, setIdx] = useState(-1);
  const [url, setUrl] = useState(null);
  const [time, setTime] = useState('');
  const [dur, setDur] = useState('');
  const [playPauseLabel, setPlayPauseLabel] = useState('...');
  const playerRef = useRef<HtmlMedia>(null);

  useEffect(() => {
    playerRef.current = new HtmlMedia();
    const h = playerRef.current;
    h.on('timeupdate', () => {
      setTime(h.timePretty);
      setDur(h.durationPretty);
    });
    h.on('statechange', () => {
      console.warn(h.state);
      if (h.state === PlayerState.PAUSED) {
        setPlayPauseLabel('Play');
      } else if (h.state === PlayerState.PLAYING) {
        setPlayPauseLabel('Pause');
      } else {
        setPlayPauseLabel('...');
      }
    });
    return () => {
      h.destroy(true);
    }
  }, []);

  useEffect(() => {
    if (idx === -1) {
      setUrl(null);
      return;
    }
    (async () => {
      const s = Subsonic.getStreamingURL(initQueue[idx].id);
      setUrl(s);
    })();
  }, [idx]);

  useEffect(() => {
    if (url) {
      playerRef.current.load(url);
      playerRef.current.play();
    }
  }, [url]);

  const next = () => {
    setIdx((idx) => idx+1 >= initQueue.length ? 0 : idx+1);
  }

  const playpause = () => {
    playerRef.current.playOrPause();
  }

  return <div>
    Idx: {idx}<br/>
    Time: {time}<br/>
    Dur: {dur}<br/>
    <button onClick={next}>Next</button><br/>
    <button onClick={playpause}>{playPauseLabel}</button>
  </div>;
}