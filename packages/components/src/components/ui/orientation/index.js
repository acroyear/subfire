import { useState, useEffect } from 'react';

export {default as Landscape} from './Landscape';
export {default as LandscapeGrid} from './LandscapeGrid';
export {default as Portrait} from './Portrait';
export {default as PortraitGrid} from './PortraitGrid';

export const useComponentSize = (comRef) => {
  const [size, setSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    const sizeObserver = new ResizeObserver((entries, observer) => {
      entries.forEach(({ target }) => {
        setSize(s => ({ width: target.clientWidth || s.width, height: target.clientHeight || s.height }));
      });
    });
    sizeObserver.observe(comRef.current);

    return () => sizeObserver.disconnect();
  }, [comRef]);

  return size;
};

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // console.log('handleResize', window.innerWidth, window.innerHeight);
      // Set window width/height to state but don't let it set 0's
      setWindowSize(d => ({
        width: window.innerWidth || d.width,
        height: window.innerHeight || d.height,
      }));
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export const isPortrait = (d) => (d.width <= d.height);
export const isLandscape = (d) => (d.width > d.height);
