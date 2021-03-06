import { Subsonic } from '.';
import { arrayShuffle } from './utils/utils';
import { BookmarkQueueRule, Song } from './SubsonicTypes';

function persistLastPlayingQueue<T extends MinimalMediaObject>(lpq: QueueModel<T>) {
    lpq.currentTime = lpq.currentTime || 0;
    localStorage.setItem('subsonic.lastPlaying', JSON.stringify(lpq));
    localStorage.setItem('subsonic.lastPlaying.currentMediaTime', "" + lpq.currentTime);
}

function loadLastPlayingQueue<T extends MinimalMediaObject>(): QueueModel<T> {
    const lastPlayingQueue = JSON.parse(localStorage.getItem('subsonic.lastPlaying') || "{}") as QueueModel<T>;
    const lastPlayingTime = lastPlayingQueue.currentTime || parseInt(localStorage.getItem('subsonic.lastPlaying.currentMediaTime') || '0');
    lastPlayingQueue.currentTime = lastPlayingTime || 0;
    lastPlayingQueue.queueName = lastPlayingQueue.queueName || 'Last Playing';
    return lastPlayingQueue;
}

export function persistCurrentPlayingTime(currentTime: number) {
    const x = loadLastPlayingQueue();
    x.currentTime = currentTime;
    persistLastPlayingQueue(x);
}

export interface MinimalMediaObject {
    id: string;
    src?: string;
    coverArt?: string
    coverArtUrl?: string
}

export interface QueueModel<T extends MinimalMediaObject> {
    queue: Array<T>
    idx: number
    current?: T
    currentTime?: number
    queueName?: string
    rule?: BookmarkQueueRule
}

export interface SkipAlbumMethod<T extends MinimalMediaObject> {
    (qm: QueueModel<T>): number
}

export interface SubsonicQueueEvent<T extends MinimalMediaObject> {
    data: QueueModel<T>;
    previous: QueueModel<T>
}

export interface SubsonicQueueEventListener<T extends MinimalMediaObject> {
    (evt: SubsonicQueueEvent<T>): void
}

export type SubsonicQueueEventType = 'current' | 'queue' | 'idx' | 'change';

function arrayEquals(a: any, b: any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

export class SubsonicQueueImpl<T extends MinimalMediaObject> implements QueueModel<T> {
    queue: Array<T>
    idx: number
    current?: T
    currentTime?: number
    queueName?: string
    rule?: BookmarkQueueRule;

    previousQueue: Array<T>
    previousIdx: number
    previousCurrent?: T

    listeners: Map<SubsonicQueueEventType, SubsonicQueueEventListener<T>[]>

    skipAlbumMethod: SkipAlbumMethod<T> = (qm: QueueModel<T>) => {
        return qm.idx + 1;
    }

    constructor(skipAlbumMethod?: SkipAlbumMethod<T>) {
        this.queue = [];
        this.idx = -1;
        this.current = null;
        this.currentTime = 0;
        this.queueName = 'uninitialized';
        this.rule = null;

        this.skipAlbumMethod = skipAlbumMethod;

        this.previousQueue = [];
        this.previousIdx = 0;
        this.previousCurrent = null;

        this.listeners = new Map();
    }

    addEventListener = (evtType: SubsonicQueueEventType, listener: SubsonicQueueEventListener<T>) => {
        let x = this.listeners.get(evtType);
        if (x == null) {
            x = [];
            this.listeners.set(evtType, x);
        }
        x.push(listener);
    }

    removeEventListener = (evtType: SubsonicQueueEventType, listener: SubsonicQueueEventListener<T>) => {
        let x = this.listeners.get(evtType);
        if (x == null) return;
        const i = x.indexOf(listener);
        x.splice(i, 1);
    }

    dispatchEvent = (evtType: SubsonicQueueEventType) => {
        let x = this.listeners.get(evtType) || [];
        for (const l of x) {
            l({
                data: this.getState(),
                previous: {
                    queue: this.previousQueue,
                    idx: this.previousIdx,
                    current: this.previousCurrent,
                    rule: this.rule
                }
            })
        }
    }

    _checkAndDispatchEvents = () => {
        let dispatchChange = false;
        if (!arrayEquals(this.queue, this.previousQueue)) {
            this.dispatchEvent('queue');
            dispatchChange = true;
        }
        if (this.idx !== this.previousIdx) {
            this.dispatchEvent('idx');
            dispatchChange = true;
        }
        if (this.current !== this.previousCurrent) {
            this.dispatchEvent('current');
            dispatchChange = true;
        }
        if (dispatchChange) {
            this.dispatchEvent('change');
        }
        this.previousCurrent = this.current;
        this.previousIdx = this.idx;
        this.previousQueue = [...this.queue];

        persistLastPlayingQueue({
            queue: this.queue,
            idx: this.idx,
            queueName: this.queueName,
            rule: this.rule,
            currentTime: 0,
            current: this.current
        });
    }

    _checkCurrent = (resetTime: boolean = true) => {
        let x = null;
        if (this.queue.length) {
            if (this.idx >= this.queue.length) {
                this.idx = 0;
            } else if (this.idx <= -1) {
                this.idx = this.queue.length - 1;
            }
            this.current = this.queue[this.idx];

            this.current.src = this.current.src || Subsonic.getStreamingURL(this.current.id);
            this.current.coverArtUrl = this.current.coverArtUrl || Subsonic.getCoverArtURL(this.current.coverArt || this.current.id || "-1");
            if (resetTime) {
                this.currentTime = 0;
            }
        }
    }

    setLastPlayingQueue(lpq: QueueModel<T>) {
        this.set(
            lpq.queue,
            lpq.idx,
            lpq.currentTime,
            lpq.queueName,
            lpq.rule
        );
    }

    set = (queue: Array<T>, idx: number = 0, currentTime?: number, queueName?: string, rule?: BookmarkQueueRule) => {
        this.queue = queue;
        this.idx = idx;
        this.currentTime = currentTime || null;
        this.queueName = queueName || 'Subsonic Queue';
        this.rule = rule;
        this._checkCurrent(false);
        this._checkAndDispatchEvents();
    }

    next = () => {
        ++this.idx;
        this._checkCurrent();
        this._checkAndDispatchEvents();
    }

    prev = () => {
        --this.idx;
        this._checkCurrent();
        this._checkAndDispatchEvents();
    }

    skipAlbum = () => {
        this.idx = this.skipAlbumMethod(this);
        this._checkCurrent();
        this._checkAndDispatchEvents();
    }

    getIds = () => {
        return this.queue.map(x => x.id);
    }

    skipTo = (i: number) => {
        this.idx = i;
        this._checkCurrent();
        this._checkAndDispatchEvents();
    }

    shuffle = (preserveCurrent: boolean = true): void => {
        const current = this.current;
        let a = arrayShuffle(this.queue);
        a = arrayShuffle(this.queue);
        a = arrayShuffle(this.queue);
        a = arrayShuffle(this.queue);
        a = arrayShuffle(this.queue);
        const idx = preserveCurrent ? a.findIndex((s:MinimalMediaObject) => s.id === current.id) : 0;
        this.idx = idx;
        this.queue = a;
        this._checkCurrent(!preserveCurrent);
        this._checkAndDispatchEvents(); 
    }

    getState = (): QueueModel<T> => {
        const x: QueueModel<T> = { 
            queue: [...this.queue],
            idx: this.idx,
            current: this.current,
            currentTime: this.currentTime,
            queueName: this.queueName
         };
        return x;
    }
}

const SubsonicSongSkipAlbum = (qm: QueueModel<Song>): number => {
    let newIdx = qm.idx;
    const q = qm.queue;
    const a = q[qm.idx].albumId;
    do {
      newIdx++;
    } while (q[newIdx] && q[newIdx].albumId === a && newIdx < q.length);
    if (!q[newIdx] || newIdx >= q.length) newIdx = 0;
    return newIdx;
}

export const SubsonicQueue = new SubsonicQueueImpl<Song>(SubsonicSongSkipAlbum);
const theLastPlayingQueue = loadLastPlayingQueue<Song>();
if (theLastPlayingQueue.queue?.length) {
    SubsonicQueue.setLastPlayingQueue(theLastPlayingQueue);
}

console.log("lastPlaying", theLastPlayingQueue.currentTime, theLastPlayingQueue);
