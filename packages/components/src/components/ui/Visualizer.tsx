import { useEffect, useState } from "react";
import { useMount } from "react-use";
import { useImagePalette } from "../../hooks/useAdjustableTheme";
import Wave from "@foobar404/wave";
import { colorThiefColorToRGB } from "@subfire/core/lib/utils/colors";

interface VisualizerProps {
    canvasId: string;
    audioId?: string;
    type: WaveTypes;
    stroke?: number;
}

export const Visualizer: React.FC<VisualizerProps> = (props) => {
    const [palette] = useImagePalette();
    const { canvasId, type, stroke, audioId = 'html-media-element' } = props;
    let [wave] = useState(new Wave());
    const audioTag = document.getElementById(audioId) as HTMLAudioElement;
    const canvasTag = document.getElementById(canvasId) as HTMLCanvasElement;

    useEffect(() => {
        if (!audioTag) {
            console.log('no audio yet');
        }
        if (!canvasTag) {
            console.log('no canvas yet');
        }
        let colors: Array<string> = [];
        // console.warn(palette);
        if (palette?.length) {
            colors = palette.map(ctc => colorThiefColorToRGB(ctc));
        }
        wave.fromElement(audioId, canvasId, { type: type, colors, stroke });
    }, [audioTag, canvasTag, type, palette]);

    return <canvas id={canvasId} style={{ width: '100%', height: '100%' }}></canvas>
}
