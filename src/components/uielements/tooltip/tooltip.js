import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TooltipWrapper } from './tooltip.style';

class Tooltip extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { children, className = '', ...props } = this.props;

    return (
      <TooltipWrapper className={`tooltip-wrapper ${className}`} {...props}>
        {children}
      </TooltipWrapper>
    );
  }
}

export default Tooltip;
