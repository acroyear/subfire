import { hexToRgb, PaletteMode, Paper, StyledEngineProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme, ThemeProvider, styled, PaletteOptions } from '@mui/material/styles';
import { ColorThiefColor, colorThiefColorToHEX, getPalette, getPerceptualBrightness, hexColorToMaterial, parseRGB } from '@subfire/core';
import { FC, useEffect, useState } from 'react';
import { createGlobalState, useMedia } from 'react-use';
import { SubfireRouterParams, Tb1 } from '..';

export const useImagePalette = createGlobalState<ColorThiefColor[]>();

// TODO migrate over use system dark mode 'auto' setting from the deprecated file

const initial: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#Ab1fb7',
    },
    secondary: {
        main: '#b2af07',
    }
};

export type SubFirePaletteMode = PaletteMode | 'auto';

export const useAdjustableThemeDark = createGlobalState<SubFirePaletteMode>(initial.mode);
export const useAdjustableThemeMaterialPalette = createGlobalState<boolean>(true);
export const useAdjustableThemeColors = createGlobalState<PaletteOptions>(initial);

export const usePrefersDarkMode = (): boolean => {
    const rv = useMedia("(prefers-color-scheme: dark)", false);
    return rv;
}

const getActualMode = (mode: SubFirePaletteMode, prefersDark = false): PaletteMode => {
    if (mode === 'auto') {
        return prefersDark ? 'dark' : 'light'
    }
    return mode as PaletteMode;
}

export const useAdjustableImagePalette = (img: HTMLImageElement) => {
    const [mode] = useAdjustableThemeDark();
    const prefersDark = usePrefersDarkMode();
    const [paletteOptions, setPaletteOptions] = useAdjustableThemeColors();
    const [material] = useAdjustableThemeMaterialPalette();
    const [src, setSrc] = useState(img?.src);
    const [_colors, setColors] = useImagePalette();
    useEffect(() => {
        if (!src) {
            setPaletteOptions(initial);
            return;
        };
        // refactor me - consolidate these methods with the RGB methods and typescript that crap
        const colors = getPalette(img);
        setColors(colors);
        if (colors?.length) {
            let primary = colorThiefColorToHEX(colors[0]);
            let secondary = colorThiefColorToHEX(colors[1]);
            if (material) {
                primary = hexColorToMaterial(primary).closestMaterialRGB
                secondary = hexColorToMaterial(secondary).closestMaterialRGB
            }
            if (primary.startsWith("#")) {
                primary = hexToRgb(primary);
            }
            if (secondary.startsWith("#")) {
                secondary = hexToRgb(secondary);
            }
            let primaryRGB = parseRGB(primary);
            const secondaryRGB = parseRGB(secondary);
            let primaryRelative = getPerceptualBrightness(primaryRGB);
            const secondaryRelative = getPerceptualBrightness(secondaryRGB);
            const actualMode = getActualMode(mode, prefersDark);
            if (actualMode === 'dark') {
                // if both colors are too dark, gray one out
                // TODO: use double-this to keep color ratio
                if (primaryRelative <= 350 && secondaryRelative <= 350) {
                    primary = "#EEEEEE";
                    primaryRGB = [238, 238, 238];
                    primaryRelative = getPerceptualBrightness(primaryRGB);
                }
                if (secondaryRelative > primaryRelative) {
                    const tmp = primary;
                    primary = secondary;
                    secondary = tmp;
                }
            } else {
                // if primary is bright on white, lets drop it down
                // todo - use half-this to preserve ratio
                if (primaryRelative >= 1350) {
                    primary = 'rgb(20,20,20)';
                }
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
    }, [src, material, mode]);

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
    const prefersDark = usePrefersDarkMode();

    const actualMode = getActualMode(mode, prefersDark);

    const theme = createTheme({
        palette: {
            ...colors,
            mode: actualMode
        }
    });

//             <Paper><Tb1>{mode} {JSON.stringify(colors)}</Tb1></Paper>

    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>)
}
