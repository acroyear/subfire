import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';

// const styles = theme => ({
//   root: {
//     color: common.white,
//     width: '25px',
//     minWidth: '50px'
//   },
//   standalone: {
//     position: 'fixed',
//     bottom: theme.spacing(2),
//     right: theme.spacing(2),
//     zIndex: 100
//   }
// });

const ActionButton = (props: any) => {
  let Component: any = Button;
  const coreProps = {
    color: props.color || 'primary',
    onClick: props.action,
    'aria-label': props.label
  } as any;
  if (props.disabled) coreProps.disabled = true;
  if (props.fab) {
    // coreProps.variant = "fab";
    Component = Fab;
    if (props.standalone) coreProps.classes = { root: props.classes.standalone };
  } else coreProps.classes = { root: props.classes.root };
  if (props.is) {
    // eslint-disable-next-line
    coreProps.component = ({ className = '', ...coreProps }) => <button {...coreProps} className={className} is={props.is} />;
  }

  return (
    <Component {...coreProps} className={props.buttonClassName}>
      {props.children}
    </Component>
  );
};

ActionButton.propTypes = {
  fab: PropTypes.bool,
  buttonClassName: PropTypes.string,
  color: PropTypes.string,
  action: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  standalone: PropTypes.bool,
  classes: PropTypes.any,
  is: PropTypes.any, // from web components?
  children: PropTypes.any
}

export default ActionButton;
