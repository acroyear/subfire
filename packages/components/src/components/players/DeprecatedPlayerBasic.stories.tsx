import { SnackbarProvider } from 'notistack';
import React from 'react';
import { Button } from '@mui/material';
import { Song, SongList, Subsonic } from '@subfire/core';
import { LoadingCard, DeprecatedPlayer, DeprecatedPlayerComponents, DeprecatedPlayerProps } from '../..';
import { useSubsonicQueue, buildProcessEnvCredentials, SubsonicProvider, IntegratedPlayerQueue } from '@subfire/hooks';

const SubsonicWrapper: React.FC<any> = (props: any) => {
    console.warn(props);
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
    title: "players/ThePlayerDeprecated"
}

const ThePlayerBasic = (components: DeprecatedPlayerComponents, current: Song, queue: SongList): JSX.Element => {
    const c = components;
    return <>
       <p>The Player?: {current?.name || current?.title}</p>
       {components.playPauseButton}
       {components.currentTime}
       {components.nextButton}
       {components.duration}
       {components.volumeButtonBelow}
       <br/>
       {components.slider}
       {current?.src}<br/>
       {components.artwork(100)}
    </>
}

export const DeprecatedPlayerTest = (_props: any) => {
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
            <DeprecatedPlayer render={ThePlayerBasic} disposeOnUnmount={true} stopMusicOnUnmount={true}></DeprecatedPlayer>
            <IntegratedPlayerQueue />
        </SnackbarProvider>
    </SubsonicWrapper>
    );
}