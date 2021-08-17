import { useWindowSize } from 'react-use';

export const Landscape = (props) => {
  const state = useWindowSize();
  if (state.width <= state.height) return null;
  return props.children;
};

export default Landscape;
