import { useEffect, useRef, useState } from "react";
import { useMount } from "react-use";
import { Wave } from "@foobar404/wave";
import { VisualizerFunction } from "./VisualizerFunction";
import { fourArcs } from './fourArcs';
import { ColorThiefColor, colorThiefColorToRGB } from "@subfire/core";
import { useImagePalette } from "../../hooks/useAdjustableTheme";

export interface VisualizerProps {
    canvasId?: string;
    audioId?: string;
    viz?: VisualizerFunction;
}

export const Visualizer: React.FC<VisualizerProps> = (props) => {
    const [palette] = useImagePalette();
    const { canvasId = "the-visualizer-canvas", audioId = 'html-media-element', viz = fourArcs } = props;
    const [wave, setWave] = useState<Wave>(null);
    const audioTag = document.getElementById(audioId) as HTMLAudioElement;
    const canvasTag = document.getElementById(canvasId) as HTMLCanvasElement;
    const lastPallet = useRef<ColorThiefColor[]>([]);

    useEffect(() => {
        if (!audioTag) {
            console.log('no audio yet');
            return;
        }
        if (!canvasTag) {
            console.log('no canvas yet');
            return;
        }
        let newwave = wave;
        if (!wave) {
            newwave = new Wave(audioTag, canvasTag);
            setWave(newwave);
        }
        if (palette !== lastPallet.current) {
            lastPallet.current = palette;
            newwave.clearAnimations();
            let colors: Array<string> = [];
            if (palette?.length) {
                colors = palette.map(ctc => colorThiefColorToRGB(ctc));
                console.log(colors);
            }
            viz(newwave, colors);
        }
    }, [audioTag, canvasTag, wave, palette]);

    return <canvas id={canvasId} style={{ width: '100%', height: '100%' }}></canvas>
}
