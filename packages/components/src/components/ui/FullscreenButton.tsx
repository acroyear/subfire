import { Fullscreen, FullscreenExit } from "mdi-material-ui";
import { FC, useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import ActionButton from "./ActionButton";

/* Get the documentElement (<html>) to display the page in fullscreen */
let elem = document.documentElement;

/* View in fullscreen */
export const openFullscreen = () => {
    // TODO: if video is playing, expand that instead
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
}

/* Close fullscreen */
export const closeFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

export interface FullscreenButtonProps {
    iconClassName?: string,
    buttonClassName?: string,
    fab?: boolean
}

export const FullscreenButton: FC<FullscreenButtonProps> = (props: FullscreenButtonProps) => {
    elem = document.documentElement;
    const documentRef = useRef<Element>(elem);
    const [fullScreen, toggleFullScreen] = useToggle(false);
    const isFullScreen = useFullscreen(documentRef, fullScreen);

    let label = "Fullscreen",
        icon = <Fullscreen className={props.iconClassName} />;
    if (isFullScreen) {
        label = "Exit Fullscreen";
        icon = <FullscreenExit className={props.iconClassName} />;
    }
    const coreProps = {
        action: toggleFullScreen,
        label: label,
        fab: props.fab,
        buttonClassName: props.buttonClassName
    };

    return <ActionButton {...coreProps}>{icon}</ActionButton>;
};

export default FullscreenButton;
