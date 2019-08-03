import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SliderWrapper } from './slider.style';

class Slider extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    onChange: () => {},
  };

  render() {
    const { className, ...props } = this.props;

    return (
      <SliderWrapper className={`slider-wrapper ${className}`} {...props} />
    );
  }
}

export default Slider;
