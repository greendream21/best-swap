import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { SliderWrapper, SliderLabel } from './slider.style';

const Slider = props => {
  const {
    value,
    onChange,
    withLabel,
    tooltipPlacement,
    className,
    ...otherProps
  } = props;
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
        value={value}
        onChange={onChange}
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
  value: PropTypes.number,
  onChange: PropTypes.func,
  defaultValue: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  tabIndex: PropTypes.string,
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
