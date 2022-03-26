import { VisualizerFunction } from "./VisualizerFunction";

export const fourArcs: VisualizerFunction = (wave, colors) => {
    let i = 0;
    for (const f of ['base', "lows", "mids", "highs"]) {
        wave.addAnimation(new wave.animations.Arcs({
            frequencyBand: f as "base" | "lows" | "mids" | "highs", // this can't be typed?
            lineWidth: 4 - i,
            lineColor: colors[i],
            fillColor: 'transparent',
            count: 5 * (4 - i)
        }));
        i++;
    }
}

export default fourArcs;
