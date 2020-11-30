import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { TooltipWrapper } from './tooltip.style';

class Tooltip extends Component {
  render() {
    const { children, className = '', ...props } = this.props;

    return (
      <TooltipWrapper className={`tooltip-wrapper ${className}`} {...props}>
        {children}
      </TooltipWrapper>
    );
  }
}

Tooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Tooltip.defaultProps = {
  className: '',
};

export default Tooltip;
