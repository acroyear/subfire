import { useState, useEffect, useRef } from "react";
import {
  HtmlMedia,
  PlayerState
} from "@subfire/core";

export const useHtmlMedia = (stopMusicOnUnmount?: boolean, disposeOnUnmount?: boolean) => {
  const [time, setTime] = useState(0);
  const [timePretty, setTimePretty] = useState('');
  const [duration, setDuration] = useState(0);
  const [durationPretty, setDurationPretty] = useState('');
  const [progress, setProgress] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(1);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [state, setState] = useState(PlayerState.IDLE);

  const playerRef = useRef<HtmlMedia>();

  useEffect(() => {
    playerRef.current = new HtmlMedia();
    const h = playerRef.current;

    setTime(h.time);
    setDuration(h.duration);
    setTimePretty(h.timePretty);
    setDurationPretty(h.durationPretty);
    setProgress(h.progress);
    setState(h.state);
    setPaused(h.paused);
    setVolumeLevel(h.volumeLevel);
    setMuted(h.muted);

    h.on('timeupdate', () => {
      setTime(h.time);
      setDuration(h.duration);
      setTimePretty(h.timePretty);
      setDurationPretty(h.durationPretty);
      setProgress(h.progress);
    });
    h.on('statechange', () => {
      setState(h.state);
      if (h.state === PlayerState.PLAYING) {
        setPaused(false);
      }
    });
    h.on('pause', () => {
      setPaused(h.paused);
    });
    h.on('volumechange', () => {
      setVolumeLevel(h.volumeLevel);
      setMuted(h.muted);
    });
    return () => {
      playerRef.current.destroy(stopMusicOnUnmount, disposeOnUnmount);
    }
  }, []);

  return {
    time, timePretty, duration, durationPretty, progress, volumeLevel, muted, paused, state, player: playerRef.current
  };
}