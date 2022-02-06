import { AdjustableThemeProvider, useAdjustableImagePalette, useAdjustableThemeDark, useAdjustableThemeMaterialPalette } from "./useAdjustableTheme";
import React, { useState, useEffect, useRef } from "react";
import { useTheme, Theme } from '@mui/material/styles';
import {
    Subsonic
} from "@subfire/core";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Checkbox, Paper, Switch } from "@mui/material";

// eslint-disable-next-line
export default {
    title: 'hooks/useAdjustableTheme'
};

const credentials = {
    server: process.env.sf_server,
    username: process.env.sf_username,
    password: process.env.sf_password,
    bitrate: process.env.sf_bitrate,
    clientName: "SubFire4Storybook",
};

const ButtonAppBar = (p: any) => {
    const theme = useTheme() as Theme;
    const color = p.color as string || 'default';
    let pal = theme.palette.primary;
    if (color === 'secondary') pal = theme.palette.secondary;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="relative" color={p.color || 'default'} enableColorOnDark={true}>
                <Toolbar variant="dense">
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
            <Paper>
                <pre>{JSON.stringify(pal)} {theme.palette.mode}</pre>
            </Paper>
        </Box>
    );
}

export const AdjustableImageTheme = () => {
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

    const [mode, setMode] = useAdjustableThemeDark();
    const [material, setMaterial] = useAdjustableThemeMaterialPalette();
    const img = useRef<HTMLImageElement>();
    useAdjustableImagePalette(img.current);
    return (<AdjustableThemeProvider>
        <ButtonAppBar />
        <ButtonAppBar color="primary" />
        <ButtonAppBar color="secondary" />
        <Paper>
            <input onChange={onChange} value={id}></input>
            <img ref={img} src={url} alt="" style={{ width: 100, height: 'auto' }} />
            Dark: <Switch checked={mode === 'dark'} onChange={(e) => setMode(e.target.checked ? 'dark' : 'light')}></Switch>
            <Checkbox checked={material} onChange={(e) => setMaterial(e.target.checked)} />
        </Paper>
    </AdjustableThemeProvider>);
}
