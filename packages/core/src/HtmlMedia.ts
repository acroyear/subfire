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

export class HtmlMediaTs {
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

        const e = this.e;
        e.addEventListener('duration', this._durationChanged);
        e.addEventListener('volumechange', this._volumeChanged);
        e.addEventListener('pause', this._pauseChanged);
        e.addEventListener('timeupdate', this._currentTimeChanged);
        e.addEventListener('ended', this._ended);
    }

    _checkPlayerState = () => {
        if (!this.e.src) {
            this.state = PlayerState.IDLE;
        } else if (this.e.paused) {
            this.state = PlayerState.PAUSED;
        } else {
            this.state = PlayerState.PLAYING;
        }
        // TODO: identify buffering - needs to monitor src change and then canplay events
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

    on = (event: MediaTriggerEvents, cb: any): HtmlMediaTs => {
        // If event is not registered, create array to store callbacks
        if (!this._events.get(event)) {
            this._events.set(event, []);
        }
        // Push callback into event array
        this._events.get(event).push(cb);
        return this
    }
    off = (event: MediaTriggerEvents, cb: any): HtmlMediaTs => {
        if (!event) {
            // if no event name was given, reset all events
            this._events = new Map();
        } else if (!this._events.get(event)) {
            this._events.set(event, []);
        }
        return this
    }
    trigger(event: MediaTriggerEvents, ...tail: any[]): HtmlMediaTs {
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
    load = (src: string, metadata: any = {}): HtmlMediaTs => {
        this.src = src;
        this.e.src = src;
        this.e.currentTime = 0;
        return this;
    }
    seek = (seconds: number, isPercentage = false): HtmlMediaTs => {
        if (isPercentage) {
            const d = this.duration;
            const s = this.duration * seconds;
            this.e.currentTime = s;
        } else {
            this.e.currentTime = seconds;
        }
        return this;
    }
    volume = (v: number): HtmlMediaTs => {
        this.lastVolumeLevel = this.e.volume || this.lastVolumeLevel || v;
        this.e.volume = v;
        return this;
    }
    muteOrUnmute = (): HtmlMediaTs => {
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
    mute = (): HtmlMediaTs => {
        this.lastVolumeLevel = this.e.volume;
        this.muteOrUnmute();
        return this;
    }
    unmute = (): HtmlMediaTs => {
        this.muteOrUnmute();
        return this;
    }
    playOrPause = (): HtmlMediaTs => {
        if (this.e.paused) {
            this.e.play().then(e => {
                console.debug(e);
            });
        } else {
            this.e.pause();
        }
        return this;
    }
    play = (): HtmlMediaTs => {
        this.playOrPause();
        return this;
    }
    pause = (): HtmlMediaTs => {
        this.playOrPause();
        return this;
    }
}