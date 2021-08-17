import React from 'react';
/* eslint react/prop-types: 0 */
// TODO: turn this into function/hooks
// requires external css and div for now - not 'automatic'
class FuzzyImageBackground extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.selector !== this.props.selector ||
      nextProps.image !== this.props.image ||
      nextProps.showBackground !== this.props.showBackground ||
      nextProps.fadeBackground !== this.props.fadeBackground
    );
  }

  componentWillUnmount() {
    // console.log('unmount');
    const { selector } = this.props;
    const e = document.querySelector(selector || '.page-bg');
    if (!e) return;
    e.style.display = 'none';
  }

  componentDidMount() {
    // console.log('mount');
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    // console.log('update');
    const { showBackground, fadeBackground, image, selector } = this.props;
    const backgroundImage = 'url(' + image + ')';
    const display = showBackground && image ? 'initial' : 'none';

    const e = document.querySelector(
      selector || '.page-bg'
    );
    if (!e) return;

    e.style.backgroundImage = backgroundImage;
    document.querySelector(selector || '.page-bg').style.display = display;

    if (fadeBackground) {
      document.querySelector(selector || '.page-bg').classList.add('faded');
    } else {
      document.querySelector(selector || '.page-bg').classList.remove('faded');
    }
  }

  render() {
    return <></>;
  }
}

export default FuzzyImageBackground;
