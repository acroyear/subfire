import { PaletteMode, Paper, StyledEngineProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme, ThemeProvider, styled, PaletteOptions } from '@mui/material/styles';
import { getPalette, colorThiefColorToRGB } from '@subfire/core/lib/utils/colors';
import { FC, useEffect, useState } from 'react';
import { createGlobalState } from 'react-use';
import { Tb1 } from '..';

const initial: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: green["400"] // '#Ab1fb7',
    },
    secondary: {
        main: '#b2af07',
    }
};

export const useAdjustableThemeDark = createGlobalState<PaletteMode>(initial.mode);
export const useAdjustableThemeColors = createGlobalState<PaletteOptions>(initial);

export const useAdjustableImagePalette = (img: HTMLImageElement) => {
    const [paletteOptions, setPaletteOptions] = useAdjustableThemeColors();
    const [src, setSrc] = useState(img?.src);
    useEffect(() => {
        console.log('loading', img?.src);
        if (!src) {
            setPaletteOptions(initial);
            return;
        };
        const colors = getPalette(img);
        if (colors?.length) {
            const primary = colors[0];
            const secondary = colors[1];
            setPaletteOptions({
                primary: {
                    main: colorThiefColorToRGB(primary),
                },
                secondary: {
                    main: colorThiefColorToRGB(secondary),
                }
            })
        } else {
            setPaletteOptions(initial);
        }
    }, [src]);

    useEffect(() => {
        const i = img;
        if (!i) return;
        i.crossOrigin = 'Anonymous';
        i.addEventListener('load', (_event) => {
            setSrc(i.src);
        })
    }, [img]);
}

export const AdjustableThemeProvider: FC = (props) => {
    const [colors] = useAdjustableThemeColors();
    const [mode] = useAdjustableThemeDark();

    const theme = createTheme({
        palette: {
            ...colors,
            mode
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Paper><Tb1>{mode} {JSON.stringify(colors)}</Tb1></Paper>
            {props.children}
        </ThemeProvider>)
}
