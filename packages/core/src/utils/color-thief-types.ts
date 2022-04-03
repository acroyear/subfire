export type ColorThiefColor = [number, number, number];
export interface ColorThiefLib {
  new(): ColorThiefLib;
  getColor: (img: HTMLImageElement | null) => ColorThiefColor;
  getPalette: (img: HTMLImageElement | null, quantity?: number, quality?: number) => ColorThiefColor[];
}
