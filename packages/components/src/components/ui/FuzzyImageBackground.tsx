import React from 'react';
/* eslint react/prop-types: 0 */
// TODO: turn this into function/hooks
// requires external css and div for now - not 'automatic'

export interface FuzzyImageBackgroundProps {
  showBackground: boolean,
  fadeBackground: boolean,
  selector: string,
  image: string
}

export class FuzzyImageBackground extends React.Component<FuzzyImageBackgroundProps> {
  shouldComponentUpdate(nextProps: FuzzyImageBackgroundProps, _nextState: any) {
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
    const e = document.querySelector(selector || '.page-bg') as HTMLElement;
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

    const e = document.querySelector(selector || '.page-bg') as HTMLElement;
    if (!e) return;

    e.style.backgroundImage = backgroundImage;
    e.style.display = display;

    if (fadeBackground) {
      e.classList.add('faded');
    } else {
      e.classList.remove('faded');
    }
  }

  render() {
    return <></>;
  }
}

export default FuzzyImageBackground;
