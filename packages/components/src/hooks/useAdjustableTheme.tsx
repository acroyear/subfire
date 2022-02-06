import { PaletteMode, Paper, StyledEngineProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme, ThemeProvider, styled, PaletteOptions } from '@mui/material/styles';
import { getPalette, colorThiefColorToRGB } from '@subfire/core/lib/utils/colors';
import { hexColorToMaterial } from '@subfire/core/lib/utils/material-color';
import { FC, useEffect, useState } from 'react';
import { createGlobalState } from 'react-use';
import { Tb1 } from '..';

const initial: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: '#Ab1fb7',
    },
    secondary: {
        main: '#b2af07',
    }
};

export const useAdjustableThemeDark = createGlobalState<PaletteMode>(initial.mode);
export const useAdjustableThemeMaterialPalette = createGlobalState<boolean>(true);
export const useAdjustableThemeColors = createGlobalState<PaletteOptions>(initial);

export const useAdjustableImagePalette = (img: HTMLImageElement) => {
    const [paletteOptions, setPaletteOptions] = useAdjustableThemeColors();
    const [material] = useAdjustableThemeMaterialPalette();
    const [src, setSrc] = useState(img?.src);
    useEffect(() => {
        console.log('loading', img?.src);
        if (!src) {
            setPaletteOptions(initial);
            return;
        };
        const colors = getPalette(img);
        if (colors?.length) {
            let primary = colorThiefColorToRGB(colors[0]);
            let secondary = colorThiefColorToRGB(colors[1]);
            console.warn(material);
            if (material) {
                primary = hexColorToMaterial(primary).closestMaterialRGB        
                secondary = hexColorToMaterial(secondary).closestMaterialRGB        
            }
            setPaletteOptions({
                primary: {
                    main: primary,
                },
                secondary: {
                    main: secondary
                }
            })
        } else {
            setPaletteOptions(initial);
        }
    }, [src, material]);

    useEffect(() => {
        const i = img;
        if (!i) {
            setSrc(null);
            return;
        };
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
