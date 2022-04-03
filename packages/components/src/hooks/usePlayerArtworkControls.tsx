import React, { ReactEventHandler, Ref, useEffect, useRef, useState } from 'react';
import { HtmlMedia, PlayerState, Subsonic } from '@subfire/core';


export interface PlayerArtworkControls {
    artwork: JSX.Element
}

export interface PlayerArtworkContents {
    size?: number
    id?: string
    ref?: Ref<HTMLImageElement>
    onLoad?: ReactEventHandler<HTMLImageElement>
    className?: string
}

export const usePlayerArtworkControls = (psc: PlayerArtworkContents): PlayerArtworkControls => {
    const { id: coverArt = "-1", size: artworkSize = 300, ref: artworkRef, onLoad: onArtworkLoad, className: artworkClassName } = psc;
    const [artworkUrl, setArtworkUrl] = useState(Subsonic.getCoverArtURL(coverArt, artworkSize));
    useEffect(() => {
        setArtworkUrl(Subsonic.getCoverArtURL(coverArt, artworkSize));
    }, [coverArt, artworkSize]);

    return {
        artwork: <img
            className={artworkClassName}
            crossOrigin="anonymous"
            onLoad={onArtworkLoad}
            ref={artworkRef}
            src={artworkUrl}
            style={artworkSize ? { width: artworkSize, height: 'auto' } : {}}
            alt=""
        />
    }

}

export default usePlayerArtworkControls;