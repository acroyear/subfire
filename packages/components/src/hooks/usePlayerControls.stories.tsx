import { SnackbarProvider } from 'notistack';
import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { useSubsonicQueue, buildProcessEnvCredentials, SubsonicProvider, IntegratedPlayerQueue } from '@subfire/hooks';
import { usePlayerControls } from './usePlayerControls';
import { LoadingCard } from '../components/ui/loader/LoadingCard';
import { Visualizer } from '../components/visualizers/Visualizer';
import { useAdjustableImagePalette } from './useAdjustableTheme';
import fourArcs from '../components/visualizers/fourArcs';

const SubsonicWrapper: React.FC<any> = (props: any) => {
    return (
        <SubsonicProvider
            clientName="SubfireStorybook"
            embeddedCredentials={buildProcessEnvCredentials()}
            LoadingCardComponent={LoadingCard}
        >
            {props.children}
        </SubsonicProvider>
    );
};

export default {
    title: "hooks/PlayerControls"
}

const ThePlayerBasic = (): JSX.Element => {
    const onArtworkLoad = () => {
        console.log('artwork loaded');
    }
    const artworkRef = useRef<HTMLImageElement>();
    const components = usePlayerControls({ artworkSize: 100, onArtworkLoad, artworkRef });
    useAdjustableImagePalette(artworkRef.current);
    const { current } = components;
    return <>
        <p>The Player?: {current?.name || current?.title}</p>
        {components.playPauseButton}
        {components.currentTime}
        {components.nextButton}
        {components.duration}
        {components.volumeButtonBelow}
        <br />
        {components.slider}
        {current?.src}<br />
        {components.artwork}
        <div style={{padding: 5, background: 'rgba(0,0,0,.50)', width: 400, height: 100}}><Visualizer viz={fourArcs}/></div>
    </>
}

export const PlayerControlsHooksTest = (_props: any) => {
    const notistackRef = React.createRef<SnackbarProvider>();
    const onClickDismiss = (key: any) => () => {
        const c = notistackRef.current as any;
        c.closeSnackbar(key);
    };

    const { set, prev, next, skipAlbum, shuffle, ...state } = useSubsonicQueue();

    const reset = () => {
        Subsonic.getPlayQueueSongs().then(sl => {
            set(sl, 0);
        }).catch(e => {
            debugger;
        });
    }

    return (<SubsonicWrapper>
        <SnackbarProvider
            ref={notistackRef}
            action={key => (
                <Button style={{ color: '#ffffff' }} size="small" onClick={onClickDismiss(key)}>
                    Dismiss
                </Button>
            )}
        >
            <Button onClick={reset}>Load Queue</Button>
            <ThePlayerBasic />
            <IntegratedPlayerQueue />
        </SnackbarProvider>
    </SubsonicWrapper>
    );
}
function seAdjustableImagePalette(artworkRef: React.Ref<HTMLImageElement>) {
    throw new Error('Function not implemented.');
}

