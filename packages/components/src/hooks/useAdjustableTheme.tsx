import { PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider, styled, PaletteOptions } from '@mui/material/styles';
import { getPalette, colorThiefColorToRGB } from '@subfire/core/lib/utils/colors';
import { FC, useEffect } from 'react';
import { createGlobalState } from 'react-use';

const initial: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#1b1fb7',
    },
    secondary: {
        main: '#e2af07',
    }
};

export const useAdjustableThemeDark = createGlobalState<PaletteMode>(initial.mode);
export const useAdjustableThemeColors = createGlobalState<PaletteOptions>(initial);

export const useAdjustableImagePalette = (img: HTMLImageElement) => {
    const [paletteOptions, setPaletteOptions] = useAdjustableThemeColors();
    const src = img.src;
    useEffect(() => {
        if (!src) return;

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
}

export const AdjustableThemeProvider: FC = (props) => {
    const [colors] = useAdjustableThemeColors();
    const [mode] = useAdjustableThemeDark();

    const theme = createTheme({
        palette: {
            ...colors,
            mode
        }
    })

    return <ThemeProvider theme={theme}>
        {props.children}
    </ThemeProvider>
}
