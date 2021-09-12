export class HtmlMediaTs {
    src: string

    title: string
    description: string
    poster: string

    time: number
    timePretty: string
    duration: number
    durationPretty: string
    progress: number

    volumeLevel: number
    lastVolumeLevel: number
    muted: boolean
    paused: boolean

    _events: { [key: string]: any[] }
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

        var e = this.e;

    }

    on = (event: string, cb: any): HtmlMediaTs => {
        // If event is not registered, create array to store callbacks
        if (!this._events[event]) {
            this._events[event] = [];
        }
        // Push callback into event array
        this._events[event].push(cb);
        return this
    }
    off = (event: string, cb: any): HtmlMediaTs => {
        if (!event) {
            // if no event name was given, reset all events
            this._events = {};
        } else if (this._events[event]) {
            // remove all callbacks from event
            this._events[event] = [];
        }
        return this
    }
    trigger(event: string, ...tail: any[]): HtmlMediaTs {
        // Slice arguments into array
        // If event exist, call callback with callback data
        for (var i in this._events[event]) {
            this._events[event][i].apply(this, tail);
        }
        // dont call global event if error
        if (event === 'error') {
            return this
        }
        // call global event handler if exist
        for (var i in this._events['event']) {
            this._events['event'][i].apply(this, [event]);
        }
        return this
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
        this.volumeLevel = v;
        this.lastVolumeLevel = v;
        return this;
    }
    muteOrUnmute = (): HtmlMediaTs => {
        if (this.volumeLevel) {
            this.lastVolumeLevel = this.e.volume;
            this.e.volume = 0;
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