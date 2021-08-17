import { useWindowSize } from 'react-use';

export const Portrait = (props) => {
  const state = useWindowSize();
  if (state.width >= state.height) return null;
  return props.children;
};

export default Portrait;
