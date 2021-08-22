import React from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import TopIcon from '@material-ui/icons/VerticalAlignTop';
import { withStyles, withTheme } from '@material-ui/core/styles';

const styles = theme => {
  return {
    fab: {
      position: 'fixed',
      zIndex: 100
    }
  };
};

const ScrollToTopFab = props => {
  const { theme, label, bottom, right, Icon, parentRef, selector, scrollParent } = props;

  const scrollToTop = props => {
    if (selector) {
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
    onClick: scrollToTop || scrollToTop.bind(this, props),
    style: {
      bottom: bottom || 30,
      right: right || 30
    }
  };

  return (
    <Fab {...fabProps} className={props.classes.fab}>
      {Icon}
    </Fab>
  );
};

ScrollToTopFab.propTypes = {
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

ScrollToTopFab.defaultProps = {
  Icon: <TopIcon />,
  label: 'top'
};

export default withStyles(styles)(withTheme(ScrollToTopFab));