import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { SliderWrapper, SliderLabel } from './slider.style';

const Slider = props => {
  const { withLabel, tooltipPlacement, className, ...otherProps } = props;
  const sliderRef = useRef();

  const handleAfterChange = () => {
    if (sliderRef.current) {
      sliderRef.current.blur();
    }
  };

  return (
    <>
      <SliderWrapper
        className={`slider-wrapper ${className}`}
        tooltipPlacement={tooltipPlacement}
        onAfterChange={handleAfterChange}
        ref={sliderRef}
        {...otherProps}
      />
      {withLabel && (
        <SliderLabel>
          <span>0%</span>
          <span>100%</span>
        </SliderLabel>
      )}
    </>
  );
};

Slider.propTypes = {
  withLabel: PropTypes.bool,
  tooltipPlacement: PropTypes.string,
  className: PropTypes.string,
};

Slider.defaultProps = {
  withLabel: false,
  tooltipPlacement: 'bottom',
  className: '',
};

export default Slider;
