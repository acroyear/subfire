import PropTypes from 'prop-types';

import Fab from '@mui/material/Fab';
import TopIcon from '@mui/icons-material/VerticalAlignTop';

export const ScrollToTopFabBase = (props: any) => {
  const { label, bottom, right, Icon, parentRef, selector, scrollParent } = props;

  const  fab = {
          position: 'fixed',
          zIndex: 100
        }

  const scrollToTop = (props: any) => {
    if (selector && selector !== "") {
      const x = document.querySelector(selector);
      x.scrollTo(0, 0);
    } else if (parentRef && parentRef.current) {
      let e = scrollParent ? parentRef.current.parentElement : parentRef.current;
      e.scrollTo(0, 0);
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      if (window.scrollTo) window.scrollTo(0, 0);
    }
  };

  const fabProps = {
    'aria-label': label,
    sx: fab,
    onClick: scrollToTop || scrollToTop.bind(this, props),
    style: {
      bottom: bottom || 30,
      right: right || 30
    }
  };

  return (
    <Fab {...fabProps}>
      {Icon}
    </Fab>
  );
};

ScrollToTopFabBase.propTypes = {
  classes: PropTypes.object,
  bottom: PropTypes.number,
  right: PropTypes.number,
  theme: PropTypes.object,
  Icon: PropTypes.object,
  label: PropTypes.string,
  selector: PropTypes.string,
  parentRef: PropTypes.object,
  scrollParent: PropTypes.bool
};

ScrollToTopFabBase.defaultProps = {
  Icon: <TopIcon />,
  label: 'top'
};
export const ScrollToTopFab = ScrollToTopFabBase;
export default ScrollToTopFabBase;
