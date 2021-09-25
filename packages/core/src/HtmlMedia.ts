import { toHHMMSS } from "../js/utils/utils";

export enum PlayerState {
    IDLE = 'IDLE',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    BUFFERING = 'BUFFERING',
    ENDED = 'ENDED'
}

export type MediaTriggerEvents = 'error' | 'available' | 'statechange' | 'connect' | 'disconnect' |
    'timeupdate' | 'volumechange' | 'mute' | 'unmute' | 'pause' | 'end' | 'buffering' | 'playing'
    | 'subtitlechange' | 'duration' | 'event';

export class HtmlMedia {
    src: string

    title: string
    description: string
    poster: string

    time: number = 0
    timePretty: string = '00:00'
    duration: number = 1
    durationPretty: string = '00:00'
    progress: number = 0;
    volumeLevel: number = 1
    muted: boolean = false
    paused: boolean = true
    state: PlayerState = PlayerState.IDLE

    lastVolumeLevel: number
    _events: Map<MediaTriggerEvents, any[]>
    e: HTMLMediaElement

    constructor(selector?: string) {
        if (selector) {
            this.e = document.querySelector(selector);
        } else {
            this.e = document.querySelector('video');
            if (!this.e) this.e = document.querySelector('audio');
            if (!this.e) {
                const a = document.createElement('audio');
                document.body.appendChild(a);
                this.e = a;
            }
        }

        this._events = new Map();

        const e = this.e;
        e.addEventListener('canplay', this._canPlayChanged);
        e.addEventListener('duration', this._durationChanged);
        e.addEventListener('volumechange', this._volumeChanged);
        e.addEventListener('pause', this._pauseChanged);
        e.addEventListener('timeupdate', this._currentTimeChanged);
        e.addEventListener('ended', this._ended);
    }

    destroy = (stopTheMusic?: boolean) => {
        const e = this.e;
        e.removeEventListener('canplay', this._canPlayChanged);
        e.removeEventListener('duration', this._durationChanged);
        e.removeEventListener('volumechange', this._volumeChanged);
        e.removeEventListener('pause', this._pauseChanged);
        e.removeEventListener('timeupdate', this._currentTimeChanged);
        e.removeEventListener('ended', this._ended);
        this.off();
        if (stopTheMusic) {
            // after events are stopped
            this.e.pause();
            this.e.src = null;
        }
    }

    _checkPlayerState = () => {
        if (!this.e.src) {
            this.state = PlayerState.IDLE;
        } else if (this.state === PlayerState.BUFFERING) {
            // no-op
        } else if (this.e.paused) {
            this.state = PlayerState.PAUSED;
        } else {
            this.state = PlayerState.PLAYING;
        }
        // TODO: identify ended
        this.trigger('statechange');
        if (this.state === PlayerState.PAUSED) {
            this.trigger('pause');
        } else if (this.state === PlayerState.PLAYING) {
            this.trigger('playing');
        // } else if (this.state === PlayerState.BUFFERING) {
        //     this.trigger('buffering');
        }
    }
    _canPlayChanged = (_evt: Event) => {
        // reset to IDLE so buffering isn't a pass-through
        this.state = PlayerState.IDLE;
        this._checkPlayerState();
    }
    _ended = (_evt: Event) => {
        this._checkPlayerState();
        this.trigger('end');
    }
    _durationChanged = (_evt: Event) => {
        this.duration = this.e.duration;
        this.durationPretty = toHHMMSS(this.duration);
        this.progress = this.time / (this.duration || 1) * 100;
        this.trigger('duration');
    }
    _volumeChanged = (_evt: Event) => {
        this.volumeLevel = this.e.volume;
        this.muted = this.e.muted;
        this.trigger('volumechange');
    }
    _pauseChanged = (_evt: Event) => {
        this.paused = this.e.paused;
        this._checkPlayerState();
    }
    _currentTimeChanged = (_evt: Event) => {
        this.time = this.e.currentTime;
        this.duration = this.e.duration;
        this.progress = this.time / (this.duration || 1) * 100;
        this.timePretty = toHHMMSS(this.time);
        this.durationPretty = toHHMMSS(this.duration);
        this.trigger('timeupdate');
    }

    on = (event: MediaTriggerEvents, cb: any): HtmlMedia => {
        // If event is not registered, create array to store callbacks
        if (!this._events.get(event)) {
            this._events.set(event, []);
        }
        // Push callback into event array
        this._events.get(event).push(cb);
        return this
    }
    // broken
    off = (event?: MediaTriggerEvents, cb?: any): HtmlMedia => {
        if (!event) {
            // if no event name was given, reset all events
            this._events = new Map();
        } else if (!this._events.get(event)) {
            this._events.set(event, []);
        }
        return this
    }
    trigger = (event: MediaTriggerEvents, ...tail: any[]): HtmlMedia => {
        // Slice arguments into array
        // If event exist, call callback with callback data
        for (const cb of this._events.get(event) || []) {
            cb.apply(this, tail);
        }
        // dont call global event if error
        if (event === 'error') {
            return this
        }
        // call global event handler if exist
        for (const cb of this._events.get('event') || []) {
            cb.apply(this, tail);
        }
        return this
    }
    load = (src: string, metadata: any = {}): HtmlMedia => {
        if (this.src !== src) {
            this.state = PlayerState.BUFFERING;
            this.src = src;
            this.e.src = src;
            this.e.currentTime = 0;
            this._checkPlayerState();
        }
        return this;
    }
    seek = (seconds: number, isPercentage = false): HtmlMedia => {
        if (isPercentage) {
            const d = this.duration;
            const s = this.duration * seconds;
            this.e.currentTime = s;
        } else {
            this.e.currentTime = seconds;
        }
        return this;
    }
    volume = (v: number): HtmlMedia => {
        this.lastVolumeLevel = this.e.volume || this.lastVolumeLevel || v;
        this.e.volume = v;
        return this;
    }
    muteOrUnmute = (): HtmlMedia => {
        if (this.e.volume) {
            this.volume(0);
        } else {
            if (this.lastVolumeLevel) {
                this.volume(this.lastVolumeLevel);
            } else {
                this.volume(1);
            }
        }
        return this;
    }
    mute = (): HtmlMedia => {
        this.lastVolumeLevel = this.e.volume;
        this.muteOrUnmute();
        return this;
    }
    unmute = (): HtmlMedia => {
        this.muteOrUnmute();
        return this;
    }
    playOrPause = (): HtmlMedia => {
        if (!this.e.src) return;
        if (this.e.paused) {
            this.e.play().then(e => {
                console.debug(e);
                //  play doesn't fire an event so we have to update
                this._checkPlayerState();
            });
        } else {
            this.e.pause();
        }
        return this;
    }
    play = (): HtmlMedia => {
        this.playOrPause();
        return this;
    }
    pause = (): HtmlMedia => {
        this.playOrPause();
        return this;
    }
}