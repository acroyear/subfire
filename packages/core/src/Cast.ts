import { TextTrackEdgeType, TextTrackType, TrackType } from "chromecast-caf-receiver/cast.framework.messages";

// Import cast framework
if (window.chrome && !window.chrome.cast) {
    var script = document.createElement('script');
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
    document.head.appendChild(script);
}

export interface CastTsOptions {
    joinpolicies?: chrome.cast.AutoJoinPolicy[],
    joinpolicy?: chrome.cast.AutoJoinPolicy,
    receiver?: string
}

interface CastSubtitleType {
    label: string
    src: string
    active: boolean
}

enum ConnectedState {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    ENDED = 'ENDED'
}

type ConnectedPlayerState = ConnectedState | chrome.cast.media.PlayerState;

type CastTriggerEvents = 'error' | 'available' | 'statechange' | 'connect' | 'disconnect' |
    'timeupdate' | 'volumechange' | 'mute' | 'unmute' | 'pause' | 'end' | 'buffering' | 'playing'
    | 'subtitlechange' | 'event';

// Castjs
export class CastTs {
    [key: string]: any
    version: string
    receiver: string
    joinpolicy: chrome.cast.AutoJoinPolicy
    available: boolean
    connected: boolean
    device: string
    src: string
    title: string
    description: string
    poster: string
    subtitles: CastSubtitleType[] // fix me
    volumeLevel: number
    muted: boolean
    paused: boolean
    time: number
    timePretty: string
    duration: number
    durationPretty: string
    progress: number
    state: ConnectedPlayerState

    _events: Map<CastTriggerEvents, any[]>;

    _player: cast.framework.RemotePlayer // this should have a type
    _controller: cast.framework.RemotePlayerController // this should have a type
    initTriesTimeout: number

    // constructor takes optional options
    constructor(opt: CastTsOptions = {}) {
        // valid join policies
        var joinpolicies = [
            chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
            chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
            chrome.cast.AutoJoinPolicy.PAGE_SCOPED
        ] as chrome.cast.AutoJoinPolicy[];

        // only allow valid join policy
        if (!opt.joinpolicies || joinpolicies.indexOf(opt.joinpolicy) === -1) {
            opt.joinpolicy = chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;
        }

        // set default receiver ID if none provided
        if (!opt.receiver || opt.receiver === '') {
            opt.receiver = 'CC1AD845';
        }

        // private variables
        this._events = new Map();
        this._player = null;
        this._controller = null;

        // public variables
        this.version = 'v4.1.2'
        this.receiver = opt.receiver;
        this.joinpolicy = opt.joinpolicy;
        this.available = false;
        this.connected = false;
        this.device = 'Chromecast';
        this.src = ''
        this.title = ''
        this.description = ''
        this.poster = ''
        this.subtitles = []
        this.volumeLevel = 1;
        this.muted = false;
        this.paused = false;
        this.time = 0;
        this.timePretty = '00:00:00';
        this.duration = 0;
        this.durationPretty = '00:00:00';
        this.progress = 0;
        this.state = ConnectedState.DISCONNECTED;

        // initialize chromecast framework
        this._init()
    }
    _getBrowser() {
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            return "Firefox: Casting is not supported in this browser."
        }
        if (navigator.userAgent.toLowerCase().indexOf('opr/') > -1) {
            return "Opera: Please enable casting, click here: https://bit.ly/2G1PMhD"
        }
        if (navigator.userAgent.toLowerCase().indexOf('iron safari') > -1) {
            return "Iron Safari: Please enable casting, click here: https://bit.ly/2G1PMhD"
        }
    }
    _init = (tries = 0): CastTs => {
        // casting only works on chrome, opera, brave and vivaldi
        if (!window.chrome || !window.chrome.cast || !window.chrome.cast.isAvailable) {
            if (tries++ > 20) {
                return this.trigger('error', 'Casting is not supported in ' + this._getBrowser());
            }
            this.initTriesTimeout = window.setTimeout(this._init, 250, tries);
            return this;
        }

        // terminate loop
        window.clearTimeout(this.initTriesTimeout);
        // initialize cast API
        cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: this.receiver,
            autoJoinPolicy: this.joinpolicy,
            language: 'en-US',
            resumeSavedSession: false,
        });
        // create remote player controller
        this._player = new cast.framework.RemotePlayer();
        this._controller = new cast.framework.RemotePlayerController(this._player);

        const rpt = cast.framework.RemotePlayerEventType;
        // register callback events
        this._controller.addEventListener(rpt.IS_CONNECTED_CHANGED, this._isConnectedChanged);
        this._controller.addEventListener(rpt.IS_MEDIA_LOADED_CHANGED, this._isMediaLoadedChanged);
        this._controller.addEventListener(rpt.IS_MUTED_CHANGED, this._isMutedChanged);
        this._controller.addEventListener(rpt.IS_PAUSED_CHANGED, this._isPausedChanged);
        this._controller.addEventListener(rpt.CURRENT_TIME_CHANGED, this._currentTimeChanged);
        this._controller.addEventListener(rpt.DURATION_CHANGED, this._durationChanged);
        this._controller.addEventListener(rpt.VOLUME_LEVEL_CHANGED, this._volumeLevelChanged);
        this._controller.addEventListener(rpt.PLAYER_STATE_CHANGED, this._playerStateChanged);
        this.available = true;
        this.trigger('available');
    }

    _isMediaLoadedChanged() {
        // don't update media info if not available
        if (!this._player.isMediaLoaded) {
            return
        }
        // there is a bug where mediaInfo is not directly available
        // so we are skipping one tick in the event loop, zzzzzzzzz
        setTimeout(() => {
            if (!this._player.mediaInfo) {
                return
            }
            // Update device name
            this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device

            // Update media variables
            this.src = this._player.mediaInfo.contentId;
            this.title = this._player.title || null;
            this.description = this._player.mediaInfo.metadata.subtitle || null;
            this.poster = this._player.imageUrl || null;
            this.subtitles = [];
            this.volumeLevel = this.volumeLevel = Number((this._player.volumeLevel).toFixed(1));
            this.muted = this._player.isMuted;
            this.paused = this._player.isPaused;
            this.time = this._player.currentTime;
            this.timePretty = this._controller.getFormattedTime(this.time);
            this.duration = this._player.duration;
            this.durationPretty = this._controller.getFormattedTime(this._player.duration);
            this.progress = this._controller.getSeekPosition(this.time, this._player.duration);
            this.state = this._player.playerState;

            // Loop over the subtitle tracks
            for (var i in this._player.mediaInfo.tracks) {
                // Check for subtitle
                if (this._player.mediaInfo.tracks[i].type === 'TEXT') {
                    // Push to media subtitles array
                    this.subtitles.push({
                        label: this._player.mediaInfo.tracks[i].name,
                        src: this._player.mediaInfo.tracks[i].trackContentId,
                        active: false
                    });
                }
            }
            // Get the active subtitle
            var active = cast.framework.CastContext.getInstance().getCurrentSession().getSessionObj().media[0].activeTrackIds;
            if (active.length && this.subtitles[active[0]]) {
                this.subtitles[active[0]].active = true;
            }
        })

    }
    // Player controller events
    _isConnectedChanged = () => {
        this.connected = this._player.isConnected;
        if (this.connected) {
            this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device
        }
        this.state = !this.connected ? ConnectedState.DISCONNECTED : ConnectedState.CONNECTED
        this.trigger('statechange')
        this.trigger(!this.connected ? 'disconnect' : 'connect')
    }
    _currentTimeChanged = () => {
        var past = this.time
        this.time = this._player.currentTime;
        this.duration = this._player.duration;
        this.progress = this._controller.getSeekPosition(this.time, this.duration);
        this.timePretty = this._controller.getFormattedTime(this.time);
        this.durationPretty = this._controller.getFormattedTime(this.duration);
        // Only trigger timeupdate if there is a difference
        if (past != this.time && !this._player.isPaused) {
            this.trigger('timeupdate');
        }
    }
    _durationChanged = () => {
        this.duration = this._player.duration;
    }
    _volumeLevelChanged = () => {
        this.volumeLevel = Number((this._player.volumeLevel).toFixed(1));
        if (this._player.isMediaLoaded) {
            this.trigger('volumechange');
        }
    }
    _isMutedChanged = () => {
        var old = this.muted
        this.muted = this._player.isMuted;
        if (old != this.muted) {
            this.trigger(this.muted ? 'mute' : 'unmute');
        }
    }
    _isPausedChanged = () => {
        this.paused = this._player.isPaused;
        if (this.paused) {
            this.trigger('pause');
        }
    }
    _playerStateChanged = () => {
        this.connected = this._player.isConnected
        if (!this.connected) {
            return
        }
        this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device
        this.state = this._player.playerState;
        switch (this.state) {
            case chrome.cast.media.PlayerState.IDLE:
                this.state = ConnectedState.ENDED;
                this.trigger('statechange');
                this.trigger('end');
                return this
            case chrome.cast.media.PlayerState.BUFFERING:
                this.time = this._player.currentTime;
                this.duration = this._player.duration;
                this.progress = this._controller.getSeekPosition(this.time, this.duration);
                this.timePretty = this._controller.getFormattedTime(this.time);
                this.durationPretty = this._controller.getFormattedTime(this.duration);
                this.trigger('statechange');
                this.trigger('buffering');
                return this
            case chrome.cast.media.PlayerState.PLAYING:
                // we have to skip a tick to give mediaInfo some time to update
                setTimeout(() => {
                    this.trigger('statechange');
                    this.trigger('playing');
                })
                return this
        }
    }
    // Class functions
    on = (event: CastTriggerEvents, cb: any): CastTs => {
        // If event is not registered, create array to store callbacks
        if (!this._events.get(event)) {
            this._events.set(event, []);
        }
        // Push callback into event array
        this._events.get(event).push(cb);
        return this
    }
    off = (event: CastTriggerEvents, cb: any): CastTs => {
        if (!event) {
            // if no event name was given, reset all events
            this._events = new Map();
        } else if (!this._events.get(event)) {
            this._events.set(event, []);
        }
        return this
    }
    trigger(event: CastTriggerEvents, ...tail: any[]): CastTs {
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
    cast = (src: string, metadata: any = {}): CastTs => {
        // We need a source! Don't forget to enable CORS
        if (!src) {
            return this.trigger('error', 'No media source specified.');
        }
        metadata.src = src;
        // Update media variables with user input
        for (var key in metadata) {
            if (metadata.hasOwnProperty(key)) {
                this[key] = metadata[key];
            }
        }
        // Time to request a session!
        cast.framework.CastContext.getInstance().requestSession().then(() => {
            if (!cast.framework.CastContext.getInstance().getCurrentSession()) {
                return this.trigger('error', 'Could not connect with the cast device');
            }
            // Create media cast object
            var mediaInfo = new chrome.cast.media.MediaInfo(this.src, 'mp3');
            mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();

            // This part is the reason why people love this library <3
            if (this.subtitles.length) {
                // I'm using the Netflix subtitle styling
                // chrome.cast.media.TextTrackFontGenericFamily.CASUAL
                // chrome.cast.media.TextTrackEdgeType.DROP_SHADOW
                mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
                mediaInfo.textTrackStyle.backgroundColor = '#00000000';
                mediaInfo.textTrackStyle.edgeColor = '#00000016';
                mediaInfo.textTrackStyle.edgeType = TextTrackEdgeType.DROP_SHADOW;
                mediaInfo.textTrackStyle.fontFamily = 'CASUAL';
                mediaInfo.textTrackStyle.fontScale = 1.0;
                mediaInfo.textTrackStyle.foregroundColor = '#FFFFFF';

                var tracks = [];
                for (let i = 0; i < this.subtitles.length; i++) {
                    // chrome.cast.media.TrackType.TEXT
                    // chrome.cast.media.TextTrackType.CAPTIONS
                    var track = new chrome.cast.media.Track(i, TrackType.TEXT);
                    track.name = this.subtitles[i].label;
                    track.subtype = TextTrackType.CAPTIONS;
                    track.trackContentId = this.subtitles[i].src;
                    track.trackContentType = 'text/vtt';
                    // This bug made me question life for a while
                    track.trackId = i;
                    tracks.push(track);
                }
                mediaInfo.tracks = tracks;
            }
            // Let's prepare the metadata
            mediaInfo.metadata.images = [new chrome.cast.Image(this.poster)];
            mediaInfo.metadata.title = this.title;
            mediaInfo.metadata.subtitle = this.description;
            // Prepare the actual request
            var request = new chrome.cast.media.LoadRequest(mediaInfo);
            // Didn't really test this currenttime thingy, dont forget
            request.currentTime = this.time;
            request.autoplay = !this.paused;
            // If multiple subtitles, use the active: true one
            if (this.subtitles.length) {
                for (var i in this.subtitles) {
                    if (this.subtitles[i].active) {
                        request.activeTrackIds = [parseInt(i)];
                        break;
                    }
                }
            }
            // Here we go!
            cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request).then(() => {
                // Update device name
                this.device = cast.framework.CastContext.getInstance().getCurrentSession().getCastDevice().friendlyName || this.device
                return this;
            }, (err) => {
                return this.trigger('error', err);
            });
        }, (err) => {
            if (err !== 'cancel') {
                this.trigger('error', err);
            }
            return this;
        });
    }
    seek = (seconds: number, isPercentage = false): CastTs => {
        // if seek(15, true) we assume 15 is percentage instead of seconds
        if (isPercentage) {
            seconds = this._controller.getSeekTime(seconds, this._player.duration);
        }
        this._player.currentTime = seconds;
        this._controller.seek();
        return this;
    }
    volume = (float: number): CastTs => {
        this._player.volumeLevel = float;
        this._controller.setVolumeLevel();
        return this;
    }
    playOrPause = (): CastTs => {
        this._controller.playOrPause();
        return this;
    }
    play = (): CastTs => {
        if (this.paused) {
            this._controller.playOrPause();
        }
        return this;
    }
    pause = (): CastTs => {
        if (!this.paused) {
            this._controller.playOrPause();
        }
        return this;
    }
    muteOrUnmute = (): CastTs => {
        this._controller.muteOrUnmute();
        return this;
    }
    mute = (): CastTs => {
        if (!this.muted) {
            this._controller.muteOrUnmute();
        }
        return this;
    }
    unmute = (): CastTs => {
        if (this.muted) {
            this._controller.muteOrUnmute();
        }
        return this;
    }
    // subtitle allows you to change active subtitles while casting
    subtitle = (index: number): CastTs => {
        // this is my favorite part of castjs
        // prepare request to edit the tracks on current session
        var request = new chrome.cast.media.EditTracksInfoRequest([index]);
        cast.framework.CastContext.getInstance().getCurrentSession().getSessionObj().media[0].editTracksInfo(request, () => {
            // after updating the device we should update locally
            // loop trough subtitles
            this.subtitles.forEach((st, i) => {
                st.active = i === index;
            });
            this.trigger('subtitlechange')
        }, (err) => {
            // catch any error
            this.trigger('error', err);
        });
        return this;
    }
    // disconnect will end the current session
    disconnect() {
        cast.framework.CastContext.getInstance().endCurrentSession(true);
        this._controller.stop();

        // application variables
        this.connected = false;
        this.device = 'Chromecast';

        // media variables
        this.src = ''
        this.title = ''
        this.description = ''
        this.poster = ''
        this.subtitles = []

        // player variable
        this.volumeLevel = 1;
        this.muted = false;
        this.paused = false;
        this.time = 0;
        this.timePretty = '00:00:00';
        this.duration = 0;
        this.durationPretty = '00:00:00';
        this.progress = 0;
        this.state = ConnectedState.DISCONNECTED;


        this.trigger('disconnect');
        return this;
    }
}

export default cast;
