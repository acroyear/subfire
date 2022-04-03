import { useEffect, useState } from 'react';

import {
    Song,
    SubsonicQueue,
    SubsonicQueueTypes
} from "@subfire/core";
console.log(SubsonicQueue);

export default {
    title: "api/Queue",
};

const initQueue: Song[] = [{ "id": "22766", "parent": "22730", "isDir": false, "title": "Between You And Me", "album": "Anoraknophobia", "artist": "Marillion", "track": 1, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 9311072, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 387, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-01 Between You And Me.mp3", "playCount": 4, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music", "coverArtURL": "https://rockpop.aboutjws.info/rest/getCoverArt.view?id=22766&size=400&v=1.15.0&f=json&c=SubFireMobile2&u=subfire&s=pawxmxpz&t=45526ec29dfbb807679fe2cbfb54a712", "src": "https://rockpop.aboutjws.info/rest/stream.view?id=22766&maxBitRate=0&v=1.15.0&f=json&c=SubFireMobile2&u=subfire&s=jintft&t=265a7242b4e201f8236304f81f5802b1" }, { "id": "22767", "parent": "22730", "isDir": false, "title": "Quartz", "album": "Anoraknophobia", "artist": "Marillion", "track": 2, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 13129118, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 546, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-02 Quartz.mp3", "playCount": 0, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music", "coverArtURL": "https://rockpop.aboutjws.info/rest/getCoverArt.view?id=22767&size=642&v=1.15.0&f=json&c=SubFireBase&u=subfire&s=ljctxhji&t=7ce0a633e0357c950f712a65e8576d9e", "src": "https://rockpop.aboutjws.info/rest/stream.view?id=22767&maxBitRate=0&v=1.15.0&f=json&c=SubFireMobile2&u=subfire&s=qbmwlu&t=ceb25019ff60b946242b6232db30adef" }, { "id": "22768", "parent": "22730", "isDir": false, "title": "Map Of The World", "album": "Anoraknophobia", "artist": "Marillion", "track": 3, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 7257796, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 302, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-03 Map Of The World.mp3", "playCount": 3, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22769", "parent": "22730", "isDir": false, "title": "When I Meet God", "album": "Anoraknophobia", "artist": "Marillion", "track": 4, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 13386798, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 557, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-04 When I Meet God.mp3", "playCount": 7, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22770", "parent": "22730", "isDir": false, "title": "The Fruit Of The Wild Rose", "album": "Anoraknophobia", "artist": "Marillion", "track": 5, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 10016387, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 417, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-05 The Fruit Of The Wild Rose.mp3", "playCount": 4, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22771", "parent": "22730", "isDir": false, "title": "Separated Out", "album": "Anoraknophobia", "artist": "Marillion", "track": 6, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 8963743, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 373, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-06 Separated Out.mp3", "playCount": 0, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22772", "parent": "22730", "isDir": false, "title": "This Is The 21st Century", "album": "Anoraknophobia", "artist": "Marillion", "track": 7, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 16014308, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 667, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-07 This Is The 21st Century.mp3", "playCount": 0, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22773", "parent": "22730", "isDir": false, "title": "If My Heart Were A Ball It Would Roll Uphill", "album": "Anoraknophobia", "artist": "Marillion", "track": 8, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 13638857, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 568, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/1-08 If My Heart Were A Ball It Woul.mp3", "playCount": 2, "discNumber": 1, "created": "2009-03-03T21:59:26.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22774", "parent": "22730", "isDir": false, "title": "Number One", "album": "Anoraknophobia", "artist": "Marillion", "track": 1, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 4049113, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 168, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-01 Number One.mp3", "playCount": 1, "discNumber": 2, "created": "2009-02-27T21:40:02.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22775", "parent": "22730", "isDir": false, "title": "Fruit Of The Wild Rose (Demo)", "album": "Anoraknophobia", "artist": "Marillion", "track": 2, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 9124202, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 380, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-02 Fruit Of The Wild Rose (Demo).mp3", "playCount": 0, "discNumber": 2, "created": "2009-02-27T21:41:24.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22776", "parent": "22730", "isDir": false, "title": "Separated Out (Demo)", "album": "Anoraknophobia", "artist": "Marillion", "track": 3, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 8732356, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 363, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-03 Separated Out (Demo).mp3", "playCount": 0, "discNumber": 2, "created": "2009-02-27T21:42:34.000Z", "albumId": "1914", "artistId": "636", "type": "music" }, { "id": "22777", "parent": "22730", "isDir": false, "title": "Between You And Me (Mark Kelly Remix)", "album": "Anoraknophobia", "artist": "Marillion", "track": 4, "year": 2001, "genre": "Rock", "coverArt": "22730", "size": 7400755, "contentType": "audio/mpeg", "suffix": "mp3", "duration": 308, "bitRate": 192, "path": "Modern Albums/Marillion/Anoraknophobia/2-04 Between You And Me (Mark Kelly.mp3", "playCount": 0, "discNumber": 2, "created": "2009-02-27T21:43:28.000Z", "albumId": "1914", "artistId": "636", "type": "music" }];

export const SubsonicQueueTest = (_p: any) => {
    const [events, setEvents] = useState<string>('');
    const appendEvent = (s: string) => {
        console.log('event', s);
        setEvents(se => se + "\n\n" + s);
    }
    const clearEvents = () => {
        setEvents(se => '');
    }

    useEffect(() => {
        console.log('init');
        const q1 = (evt: SubsonicQueueTypes.SubsonicQueueEvent<Song>) => {
            appendEvent('on queue ' + evt.data.queue.length);
        }
        const i1 = (evt: SubsonicQueueTypes.SubsonicQueueEvent<Song>) => {
            appendEvent('on idx - ' + evt.data.idx);
        }
        const c1 = (evt: SubsonicQueueTypes.SubsonicQueueEvent<Song>) => {
            appendEvent('on current - ' + evt.data.current?.title);
        }
        const all1 = (evt: SubsonicQueueTypes.SubsonicQueueEvent<Song>) => {
            appendEvent('on change');
        }
        SubsonicQueue.addEventListener('queue', q1);
        SubsonicQueue.addEventListener('idx', i1);
        SubsonicQueue.addEventListener('current', c1);
        SubsonicQueue.addEventListener('change', all1);
        return () => {
            console.log('cleanup');
            SubsonicQueue.removeEventListener('queue', q1);
            SubsonicQueue.removeEventListener('idx', i1);
            SubsonicQueue.removeEventListener('current', c1);
            SubsonicQueue.removeEventListener('change', all1);
        }
    }, []);

    const reset = () => {
        SubsonicQueue.set(initQueue, 0);
    }

    const next = () => {
        SubsonicQueue.next();
    }

    const prev = () => {
        SubsonicQueue.prev();
    }

    const skipAlbum = () => {
        SubsonicQueue.skipAlbum();
    }

    const shuffle = (preserve?: boolean) => {
        SubsonicQueue.shuffle(preserve);
    }

    const state = SubsonicQueue.getState();

    return (<>
        <button onClick={reset}>Reset</button>
        <button onClick={next}>Next</button>
        <button onClick={prev}>Prev</button>
        <button onClick={skipAlbum}>Skip</button>
        <button onClick={() => shuffle(false)}>Shuffle (reset)</button>
        <button onClick={() => shuffle()}>Shuffle (keep)</button>
        <hr />
        Current: { state.idx } --{ state.current?.title }
        < ol >
        { state.queue.map(s => <li key={s.id}>{s.title}</li>) }
        </ol >
        <hr />
        <textarea rows={10} cols={70} readOnly value={events}></textarea>
        <button onClick={clearEvents}>Clear</button>
    </>);
}