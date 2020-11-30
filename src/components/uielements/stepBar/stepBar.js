import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { StepBarWrapper } from './stepBar.style';

class StepBar extends Component {
  render() {
    const { size, ...props } = this.props;
    return (
      <StepBarWrapper size={size} {...props}>
        <div className="step-start-dot" />
        <div className="step-bar-line" />
        <div className="step-end-dot" />
      </StepBarWrapper>
    );
  }
}

StepBar.propTypes = {
  size: PropTypes.number,
};

StepBar.defaultProps = {
  size: 150,
};

export default StepBar;
