import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SliderWrapper, SliderLabel } from './slider.style';

class Slider extends Component {
  static propTypes = {
    withLabel: PropTypes.bool,
    tooltipPlacement: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    withLabel: false,
    tooltipPlacement: 'bottom',
    className: '',
  };

  render() {
    const { withLabel, tooltipPlacement, className, ...props } = this.props;

    return (
      <>
        <SliderWrapper
          className={`slider-wrapper ${className}`}
          tooltipPlacement={tooltipPlacement}
          {...props}
        />
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
