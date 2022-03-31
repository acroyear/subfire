import { VisualizerFunction } from "./VisualizerFunction";

export const shockwave: VisualizerFunction = (wave, colors): void => {
    let i = 0;
    for (const f of [/*'base',*/ "lows", "mids", "highs"] as Array<"base" | "lows" | "mids" | "highs">) {
        wave.addAnimation(new wave.animations.Wave({
            frequencyBand: f,
            lineWidth: 6,
            lineColor: colors[i],
            fillColor: 'transparent',
            count: 50,
            mirroredY: true,
            center: true
        }));
        i++;
    }
}

export default shockwave;
