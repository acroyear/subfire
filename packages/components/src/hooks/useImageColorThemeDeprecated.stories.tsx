import React, { useState, useEffect } from "react";
import { useImageColorThemeDeprecated } from './useImageColorThemeDeprecated';
import { useTheme } from '@mui/material/styles';
import {
    Subsonic
} from "@subfire/core";
import { ThemeProvider } from "@mui/material/styles";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

/** these are all deprecated in favor of useAdjustableTheme */

const ButtonAppBar = (p: any) => {
    const theme = useTheme() as any;
    return (
        <Box sx={{ flexGrow: 1 }}>
            <pre>{JSON.stringify(theme.palette.primary)}</pre>
            <pre>{JSON.stringify(theme.palette.secondary)}</pre>
            <AppBar position="static" color={p.color || 'primary'}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="primary">Login</Button>
                    <Button color="secondary">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}


const credentials = {
    server: process.env.sf_server,
    username: process.env.sf_username,
    password: process.env.sf_password,
    bitrate: process.env.sf_bitrate,
    clientName: "SubFire4Storybook",
};

export default {
    title: 'hooks/_DeprecatedColorStuffs'
};

const InteriorTest = (p: any) => {
    const {
        server,
        username,
        password,
        bitrate,
        clientName = "SubsonicStorybook",
    } = credentials;
    Subsonic.configure(server, username, password, bitrate, clientName);

    const [id, setId] = useState('22430');
    const url = Subsonic.getCoverArtURL(id || '-1', 450);

    const onChange = (evt: any) => {
        console.log(evt.target.value);
        setId(evt.target.value);
    }

    const { setImageTag, palette, theme } = useImageColorThemeDeprecated();

    const onLoad = (evt: any) => {
        console.log('loaded', evt.target.src);
        evt.target.crossOrigin = "Anonymous";
        setImageTag({ tag: evt.target });
    }

    useEffect(() => {
        p.setTheme(theme);
    }, [theme]);

    return <>

        <ButtonAppBar />
        <ButtonAppBar color="secondary" />

        <input onChange={onChange} value={id}></input>

        <img src={url} alt="" onLoad={onLoad} style={{ width: 100, height: 'auto' }} />
        <br />
        <pre>{JSON.stringify(palette)}</pre>

    </>
}

export const FirstTest = () => {
    const [theme, setTheme] = useState(null);
    console.log('hi theme', theme);
    return (
        <ThemeProvider theme={theme}>
            <InteriorTest setTheme={setTheme}></InteriorTest>
            <pre>{JSON.stringify(theme?.palette?.primary)}</pre>
            <pre>{JSON.stringify(theme?.palette?.secondary)}</pre>
        </ThemeProvider>);
}