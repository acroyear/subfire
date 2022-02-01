import { useState } from "react";
import { AdjustableThemeProvider } from "./useAdjustableTheme";

// eslint-disable-next-line
export default {
    title: 'hooks/useAdjustableTheme'
};

export const AdjustableImageTheme = () => {
    const [image, setImage] = useState()
    return (<AdjustableThemeProvider>

    </AdjustableThemeProvider>);
}