import { useEffect } from 'react';

export interface MediaSessionControls {
  play: MediaSessionActionHandler
  pause: MediaSessionActionHandler
  stop?: MediaSessionActionHandler
  nexttrack: MediaSessionActionHandler
  previoustrack: MediaSessionActionHandler
  seekbackward: MediaSessionActionHandler
  seekforward: MediaSessionActionHandler
  seekto: MediaSessionActionHandler
  hangup?: MediaSessionActionHandler
  skipad?: MediaSessionActionHandler
  togglecamera?: MediaSessionActionHandler
  togglemicrophone?: MediaSessionActionHandler
}

export interface MediaSessionHookParameters {
  element: HTMLMediaElement
  mediaMetadata: MediaMetadataInit
  controls: MediaSessionControls
}

// modified from https://github.com/nico-martin/yt-audio MIT License
export const useMediaSession = ({ element, mediaMetadata, controls }: MediaSessionHookParameters) => {
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      console.error('no mediaSession support');
      return;
    }

    if (!element || !controls || !mediaMetadata) {
      // console.log({element, controls, mediaMetadata});
      // console.error('no element or src');
      return;
    }
    navigator.mediaSession.metadata = new window.MediaMetadata({...mediaMetadata});
//(Object.keys(v) as Array<keyof typeof v>)
    (Object.keys(controls) as Array<MediaSessionAction>).
      forEach((e) => navigator.mediaSession.setActionHandler(e, controls[e]));
  }, [element, controls, mediaMetadata]);
};

export default useMediaSession;
