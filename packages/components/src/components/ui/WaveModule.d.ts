type WaveTypeValues = 'bars' |
    'bars blocks' |
    'big bars' |
    'cubes' |
    'dualbars' |
    'dualbars blocks' |
    'fireworks' |
    'flower' |
    'flower blocks' |
    'orbs' |
    'ring' |
    'rings' |
    'round wave' |
    'shine' |
    'shine rings' |
    'shockwave' |
    'star' |
    'static' |
    'stitches' |
    'web' |
    'wave';

type WaveTypes = WaveTypeValues | Array<WaveTypeValues>;

interface WaveOptions {
    stroke?: number;
    colors?: Array<string>;
    type: WaveTypes;
}

declare class Wave {
    constructor() { }
    fromElement: (audioId: string, canvasId: string, options: WaveOptions) => void;
    fromStream: (string: MediaStream, canvasId: string, options: WaveOptions) => void;
    stopStream: () => void;
    fromFile: (file: string, options: WaveOptions) => void;
    // supplied by the client
    onFileLoad?: (imageDataURI: any) => void;
}

declare module "@foobar404/wave" {
    export = Wave
};
