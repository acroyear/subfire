import { useState, useEffect } from 'react';
import { singletonHook } from 'react-singleton-hook';

import { MaterialColor, Colors } from '@subfire/core';
import { createTheme, useTheme } from '@mui/material/styles';

import {
  amber, blue, blueGrey, brown, cyan,
  deepOrange, deepPurple, green, grey, indigo, lightBlue, lightGreen,
  lime, orange, pink, purple, red, teal, yellow,
} from '@mui/material/colors';
import { PaletteMode } from '@mui/material';

interface MaterialColorStandardShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  A100: string;
  A200: string;
  A400: string;
  A700: string;
  [key: string | number]: string;
};

const { colorToMaterial } = MaterialColor;

export interface ImageElementTag {
  tag: HTMLImageElement
}

interface ColorSet {
  [key: string]: MaterialColorStandardShades
}

const colors: ColorSet = {
  amber: amber,
  blue: blue,
  blueGrey: blueGrey,
  brown: brown,
  cyan: cyan,
  deepOrange: deepOrange,
  deepPurple: deepPurple,
  green: green,
  grey: grey,
  indigo: indigo,
  lightBlue: lightBlue,
  lightGreen: lightGreen,
  lime: lime,
  orange: orange,
  pink: pink,
  purple: purple,
  red: red,
  teal: teal,
  yellow: yellow
};

const indexes = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const aIndex = ['A100', 'A200', 'A400', 'A700'];

const x = amber['500'];
const y = amber[500];
console.error(x === y);

function findIndexes(key: string) {
  let m, l, d;
  if (key.startsWith('A')) {
    if (key === 'A100') key = '200';
    if (key === 'A200') key = '400';
    if (key === 'A400') key = '500';
    if (key === 'A700') key = '700';
  }

  m = key;
  const i = indexes.indexOf(m);
  l = i - 2;
  if (l < 0) l = 0;
  l = indexes[l];

  d = i + 2;
  if (d < 9) d = 9;
  d = indexes[d];

  return { m, l, d };
}

function parseColor(cname: string): string[] {
  let c = cname.split('-');
  if (c.length === 2) {
    // console.log(c);
  } else {
    console.warn('oops', c);
  }
  return c;
}

function genThemePaletteFromColor(c: Colors.RGB | number[], _p: unknown) {
  console.warn("genThemePaletteFromColor", c);
  const mc = Array.isArray(c) ? colorToMaterial(c[0], c[1], c[2]) : colorToMaterial(c.r, c.g, c.b);
  let colorName = mc.closestMaterialName;
  // console.log(colorName);
  // brown is boring...`
  // if (colorName.startsWith('brown')) {
  //   colorName = colorToMaterial(...p[3]).closestMaterialName;
  //   // console.log('replaced with ', colorName)
  // }
  // console.log(mc);
  let colorKeys = parseColor(colorName);
  if (colorKeys.length === 2) {
    if (colorKeys[0] === 'black') colorKeys = ['grey', '800'];
    if (colorKeys[0] === 'white') colorKeys = ['grey', '400'];
    colorName = colorKeys[0];
    const ac = colors[colorName];
    // console.log(ac);
    const idx = findIndexes(colorKeys[1]);
    // if (!ac || !idx) {
    //   debugger;
    // }
    return {
      light: ac[idx.l],
      main: ac[idx.m],
      dark: ac[idx.d]
    };
  } else {
    return null;
  }
}

export function useImageColorThemeImpl() {
  const appTheme = useTheme();
  const [imageTag, setImageTag] = useState<ImageElementTag>({ tag: null });
  const [palette, setPalette] = useState(null);
  const [theme, setTheme] = useState(appTheme);

  useEffect(() => {
    console.warn(imageTag); 
    if (!imageTag?.tag) return;
    const p = Colors.getPalette(imageTag.tag);
    setPalette(p);
  }, [setPalette, imageTag]);

  useEffect(() => {
    if (!palette?.length) {
      setTheme(appTheme);
      return;
    }

    const primary = genThemePaletteFromColor(palette[0], palette);
    const secondary = genThemePaletteFromColor(palette[1], palette);

    const config = {
      palette: {
        primary: primary,
        secondary: secondary,
        // mode: 'dark' as PaletteMode
      }
    };
    const theme = createTheme(config);
    setTheme(theme);
  }, [palette, setTheme, appTheme]);

  const resetTheme = () => {
    setTheme(createTheme({
      palette: {
        // mode: 'dark' as PaletteMode
      }
    }));
  }

  return { imageTag, setImageTag, palette, theme, setTheme, resetTheme };
}

export const useImageColorTheme = singletonHook({ imageTag: null, setImageTag: () => {}, palette: null, theme: null, resetTheme: () => {}, setTheme: () => {} }, useImageColorThemeImpl);
export default useImageColorTheme;
