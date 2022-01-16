import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Button } from '@mui/material';
import { Subsonic, SubsonicTypes } from '@subfire/core';
import { useSubsonicQueue, buildProcessEnvCredentials, SubsonicProvider, IntegratedPlayerQueue } from '@subfire/hooks';
import { usePlayerControls } from './usePlayerControls';
import { LoadingCard } from '../components/ui/loader/LoadingCard';

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
    const components = usePlayerControls({ artworkSize: 100, onArtworkLoad });
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
        Subsonic.getAlbumSongs('1332').then(sl => {
            set(sl, 0);
        })
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
