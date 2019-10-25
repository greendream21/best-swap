import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SliderWrapper, SliderLabel } from './slider.style';

class Slider extends Component {
  static propTypes = {
    withLabel: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    withLabel: false,
    className: '',
  };

  render() {
    const { withLabel, className, ...props } = this.props;

    return (
      <>
        <SliderWrapper className={`slider-wrapper ${className}`} {...props} />
        {withLabel && (
          <SliderLabel>
            <span>0%</span>
            <span>100%</span>
          </SliderLabel>
        )}
      </>
    );
  }
}

export default Slider;
