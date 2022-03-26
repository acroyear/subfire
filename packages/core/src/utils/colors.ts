import ColorThief1 from './color-thief';
const ColorThief2 = ColorThief1 as unknown;
export type ColorThiefColor = [number, number, number];
export interface ColorThiefLib {
  new(): ColorThiefLib;
  getColor: (img: HTMLImageElement | null) => ColorThiefColor;
  getPalette: (img: HTMLImageElement | null, quantity?: number, quality?: number) => ColorThiefColor[];
}

export const colorThiefColorToHEX = (ctc: ColorThiefColor): string => {
  return "#" + (new RGB(ctc).toHexString());
}

export const colorThiefColorToRGB = (ctc: ColorThiefColor): string => {
  return new RGB(ctc).toRGBString();
}

interface GradientsPalette {
  gradients: string[],
  palette: ColorThiefColor[];
}

// stupid module crap don't work
const ColorThief = ColorThief2 as ColorThiefLib;

export class CanvasImage {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(a: CanvasImageSource) {
    this.canvas = document.createElement("canvas"),
      this.context = this.canvas.getContext("2d"),
      document.body.appendChild(this.canvas),
      this.width = this.canvas.width = a.width as number,
      this.height = this.canvas.height = a.height as number,
      this.context.drawImage(a, 0, 0, this.width, this.height);
  };
  clear = () => {
    this.context.clearRect(0, 0, this.width, this.height);
  };

  update = (a: ImageData) => {
    this.context.putImageData(a, 0, 0);
  };
  getPixelCount = () => {
    return this.width * this.height;
  };

  getImageData = () => {
    return this.context.getImageData(0, 0, this.width || 1, this.height || 1);
  };

  removeCanvas = () => {
    this.canvas.parentNode.removeChild(this.canvas);
  };
}

export class RGB {
  r: number;
  g: number;
  b: number;

  constructor(c0: string | Array<number> | number, c1?: string | number, c2?: string | number) {
    var isArray = Array.isArray(c0);
    if (!isArray) {
      if (typeof c0 === "string" && c0.length && c0[0] === "#") {
        c2 = c0.substr(5, 2);
        c1 = c0.substr(3, 2);
        c0 = c0.substr(1, 2);

        this.b = parseInt(c2, 16);
        this.g = parseInt(c1, 16);
        this.r = parseInt(c0, 16);
      } else {
        this.b = c2 as number;
        this.g = c1 as number;
        this.r = c0 as number;
      }
    } else {
      const c = c0 as Array<number>;
      this.r = Math.min(Math.floor(c[0]), 255);
      this.g = Math.min(Math.floor(c[1]), 255);
      this.b = Math.min(Math.floor(c[2]), 255);
    }
  }

  //returns range from 0 to 255
  //from http://alienryderflex.com/hsp.html by way of http://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  brightness = (): number => {
    var r = this.r,
      g = this.g,
      b = this.b;
    return Math.sqrt(r * r * 0.241 + g * g * 0.691 + b * b * 0.068);
  };

  toHexString = (): string => {
    var r = (this.r * 1).toString(16);
    if (r.length === 1) r = "0" + r;
    var g = (this.g * 1).toString(16);
    if (g.length === 1) g = "0" + g;
    var b = (this.b * 1).toString(16);
    if (b.length === 1) b = "0" + b;

    return r + g + b;
  };

  toRGBString = (): string => {
    var rgb = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    return rgb;
  };

  toHalfBright = (): RGB => {
    var rgb = new RGB(this.r / 2, this.g / 2, this.b / 2);
    return rgb;
  };

  toTwiceBright = (): RGB => {
    var rgb = new RGB(this.r * 2, this.g * 2, this.b * 2);
    return rgb;
  };

  toThreeFourthsBright = (): RGB => {
    var rgb = new RGB(this.r * 0.75, this.g * 0.75, this.b * 0.75);
    return rgb;
  };
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
export const getRandomIntInclusive = function (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var p, colorThief;

export function getPalette(img: HTMLImageElement, colorCount = 6) {
  colorThief = new ColorThief();
  p = colorThief.getPalette(img, colorCount);
  return p;
}

export const Gradients = {
  createLinearGradients: function (img: HTMLImageElement | ColorThiefColor[], colorCount = 6) {
    let p: ColorThiefColor[];
    try {
      if ((img as HTMLImageElement).nodeName) {
        p = getPalette((img as HTMLImageElement), colorCount);
      } else {
        p = img as ColorThiefColor[];
      }
    } catch (e) {
      // usually caused by flipping "next" too fast
      console.warn(e);
      return [];
    }
    var c1,
      c2 = new RGB(0, 0, 0),
      rgb1,
      rgb2,
      gradstring;
    var gradients = [],
      max = Math.max(p.length, 6);
    for (var i = 0; i < max; ++i) {
      c1 = new RGB(p[i]);
      if (c1.brightness() > 130) c1 = c1.toHalfBright();
      rgb1 = c1.toRGBString();
      rgb2 = c2.toRGBString();
      gradstring = "linear-gradient(" + rgb2 + ", " + rgb1 + ")";
      gradients.push(gradstring);

      c2 = c1.toHalfBright();
      rgb1 = c1.toRGBString();
      rgb2 = c2.toRGBString();
      gradstring = "linear-gradient(" + rgb1 + ", " + rgb2 + ")";
      gradients.push(gradstring);

      if (i === max - 1) {
        c1 = new RGB(0, 0, 0);
        rgb1 = c1.toRGBString();
        gradstring = "linear-gradient(" + rgb2 + ", " + rgb1 + ")";
        gradients.push(gradstring);
      }
    }
    return gradients;
  },

  createCenterGradients: function (img: HTMLImageElement | ColorThiefColor[], colorCount = 6) {
    let p: ColorThiefColor[];
    try {
      if ((img as HTMLImageElement).nodeName) {
        p = getPalette((img as HTMLImageElement), colorCount);
      } else {
        p = img as ColorThiefColor[];
      }
    } catch (e) {
      // usually caused by flipping "next" too fast
      console.warn(e);
      return [];
    }
    var gradients = [];
    for (var i = 0; i < 4; ++i) {
      var c = new RGB(p[i]);
      if (c.brightness() > 130) c = c.toHalfBright();
      var c2 = c.toHalfBright();
      var rgb = c.toRGBString();
      var rgb2 = c2.toRGBString();
      var gradstring = "radial-gradient(" + rgb + ", " + rgb2 + ")";
      gradients.push(gradstring);
    }
    return gradients;
  },

  gradientTypes: [
    "linear-gradient(",
    "linear-gradient(45deg,",
    "linear-gradient(135deg,",
    "radial-gradient("
  ],

  createRandomGradients: function (img: HTMLImageElement | ColorThiefColor[], colorCount = 6, count = 4, excludeRadial = false): GradientsPalette {
    let p: ColorThiefColor[];
    try {
      if ((img as HTMLImageElement).nodeName) {
        p = getPalette((img as HTMLImageElement), colorCount);
      } else {
        p = img as ColorThiefColor[];
      }
    } catch (e) {
      // usually caused by flipping "next" too fast
      console.warn(e);
      return { gradients: [], palette: p };
    }

    var i,
      colors = [],
      halfColors = [],
      c,
      hc,
      c1,
      c2,
      ci;
    if (!colorCount) colorCount = 6;
    if (!count) count = 4;
    try {
      for (i = 0; i < p.length; ++i) {
        c = new RGB(p[i]);
        if (c.brightness() > 130) c = c.toHalfBright();
        hc = c.toHalfBright();
        colors.push(c);
        halfColors.push(hc);
      }
    } catch (e) {
      // usually caused by flipping "next" too fast
      console.warn(e);
      return { gradients: [], palette: p };
    }
    var gradients = [];
    for (i = 0; i < count; ++i) {
      var gradientLimit = this.gradientTypes.length - 1;
      if (excludeRadial) gradientLimit -= 1;
      const type1 = getRandomIntInclusive(0, gradientLimit);
      // console.log("type 0-3", type);
      const type = this.gradientTypes[type1];

      var start = 0,
        end = 9;
      if (type === "radial-gradient(") {
        // radials should only use the internal
        start = 2;
        end = 5;
      }

      var ctype = getRandomIntInclusive(start, end);
      // console.log("ctype 0-9", ctype);
      var clength = colors.length - 1;
      switch (ctype) {
        // toggle with black
        case 0:
          c1 = new RGB(0, 0, 0);
          c2 = colors[getRandomIntInclusive(0, clength)];
          break;
        case 1:
          c1 = colors[getRandomIntInclusive(0, clength)];
          c2 = new RGB(0, 0, 0);
          break;
        // toggle with its own half-color
        case 2:
        case 3:
          ci = getRandomIntInclusive(0, clength);
          c1 = colors[ci];
          c2 = halfColors[ci];
          break;
        case 4:
        case 5:
          ci = getRandomIntInclusive(0, clength);
          c1 = halfColors[ci];
          c2 = colors[ci];
          break;
        // toggle with its a (potentially) different half-color
        case 6:
        case 7:
          ci = getRandomIntInclusive(0, clength);
          c1 = colors[ci];
          ci = getRandomIntInclusive(0, clength);
          c2 = halfColors[ci];
          break;
        case 8:
        case 9:
          ci = getRandomIntInclusive(0, clength);
          c1 = halfColors[ci];
          ci = getRandomIntInclusive(0, clength);
          c2 = colors[ci];
          break;
      }
      var rgb = c1.toRGBString();
      var rgb2 = c2.toRGBString();
      var gradstring = type + rgb + ", " + rgb2 + ")";
      gradients.push(gradstring);
    }
    return { gradients: gradients, palette: p };
  }
};

export const getContrastYIQ = (color: string | ColorThiefColor): 'white' | 'black' => {
  const hex = '#';
  let r: number, g: number, b: number;
  if (typeof color === 'string') {
    if (color.indexOf(hex) > -1) {
      r = parseInt(color.substring(0, 2), 16);
      g = parseInt(color.substring(2, 2 + 2), 16);
      b = parseInt(color.substring(4, 4 + 2), 16);
    } else {
      const rgb = color.match(/\d+/g);
      r = parseInt(rgb[0]);
      g = parseInt(rgb[1]);
      b = parseInt(rgb[2]);
    }
  }
  else {
    r = color[0];
    g = color[1];
    b = color[2];
  }

  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}