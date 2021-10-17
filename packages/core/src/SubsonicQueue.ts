import { arrayShuffle } from '../js/utils/utils';
import { Song } from './SubsonicTypes';

export interface HasId {
    id: string;
}

export interface QueueRule {
    id?: string;
    type?: string;
    mode?: string;
}

export interface QueueModel<T extends HasId> {
    queue: Array<T>
    idx: number
    current?: T
    currentTime?: number
    queueName?: string
}

export interface SkipAlbumMethod<T extends HasId> {
    (qm: QueueModel<T>): number
}

export interface SubsonicQueueEvent<T extends HasId> {
    data: QueueModel<T>;
    previous: QueueModel<T>
}

export interface SubsonicQueueEventListener<T extends HasId> {
    (evt: SubsonicQueueEvent<T>): void
}

export type SubsonicQueueEventType = 'current' | 'queue' | 'idx' | 'change';

function arrayEquals(a: any, b: any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

export class SubsonicQueueImpl<T extends HasId> implements QueueModel<T> {
    queue: Array<T>
    idx: number
    current?: T
    currentTime?: number
    queueName?: string
    rule?: QueueRule;

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
        this.rule = {};

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
                    current: this.previousCurrent
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
    }

    _checkCurrent = () => {
        let x = null;
        if (this.queue.length) {
            if (this.idx >= this.queue.length) {
                this.idx = 0;
            } else if (this.idx <= -1) {
                this.idx = this.queue.length - 1;
            }
            this.current = this.queue[this.idx];
        }
    }

    set = (queue: Array<T>, idx: number = 0, currentTime?: number, queueName?: string, rule?: QueueRule) => {
        this.queue = queue;
        this.idx = idx;
        this.currentTime = currentTime || null;
        this.queueName = queueName || 'Subsonic Queue';
        this.rule = rule;
        this._checkCurrent();
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
        const idx = preserveCurrent ? a.findIndex((s:HasId) => s.id === current.id) : 0;
        this.idx = idx;
        this.queue = a;
        this._checkCurrent();
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
