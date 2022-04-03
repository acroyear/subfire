import { useState } from "react";
import { useInterval } from "react-use";

const formatTime = (d: Date) => {
    return d.getHours() + ":" + d.getMinutes();
}

export const useClock = () => {
    const [clock, setClock] = useState(formatTime(new Date()));
    useInterval(() => {
        setClock(c => formatTime(new Date()));
    }, 1000);
    return clock;
}

export default useClock;
