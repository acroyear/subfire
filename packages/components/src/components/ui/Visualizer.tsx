import { useMount } from "react-use";
import { useImagePalette } from "../../hooks/useAdjustableTheme";

export const Visualizer: React.FC<any> = (props) => {
    const [palette] = useImagePalette();
    const { id } = props;
console.log(id, palette);
    useMount(() => console.warn('MOUNTED', document.getElementById(id)));

    return <canvas id={id} style={{width: '100%', height: '100%'}}></canvas>
}