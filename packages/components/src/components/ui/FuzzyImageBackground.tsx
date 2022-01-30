import { CSSProperties, useCallback, useState } from "react";
import { useLifecycles } from "react-use";
import { FuzzyBackgroundImageStates, useFuzzyImageBackgroundImage, useFuzzyImageBackgroundState, useFuzzyImageBackgroundStates } from "../../hooks/useFuzzyImageBackground";

export interface FuzzyBackgroundImageState {
    states: Record<string, CSSProperties>;
    currentState: string;
    currentImage: string;
}

export const FuzzyImageBackground: React.FC<FuzzyBackgroundImageState> = (props) => {
    const [states, setStates] = useFuzzyImageBackgroundStates();
    const [currentState, setCurrentState] = useFuzzyImageBackgroundState();
    const [currentImage, setCurrentImage] = useFuzzyImageBackgroundImage();
    console.debug('in', props);
    console.debug('hooks', states, currentState, currentImage);

    useLifecycles(() => {
        console.debug('mount', props);
        setStates(() => states || props.states);
        setCurrentState(() => currentState || props.currentState);
        setCurrentImage(() => currentImage || props.currentImage);
    },
        () => {
            console.debug('unmount');
            setStates(() => null as FuzzyBackgroundImageStates);
            setCurrentState(() => null as string);
            setCurrentImage(() => null as string);
        });

    let style: CSSProperties = states && currentState ? { ...states[currentState] } || {} : {};
    style = {
        ...style,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    style.backgroundImage = states && currentState && states[currentState] && currentImage ? `url(${currentImage})` : 'none';
    // TODO: memo this if it gets called too often
    console.debug(currentState, states, style);
    return <>
        <div style={style} className="fuzzy-image-background"></div>
        <div style={{ position: "relative", zIndex: 1 }}>{props.children}</div>
    </>
}

export default FuzzyImageBackground;
