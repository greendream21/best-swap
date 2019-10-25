import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StepBarWrapper } from './stepBar.style';

class StepBar extends Component {
  static propTypes = {
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 150,
  };

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

export default StepBar;
