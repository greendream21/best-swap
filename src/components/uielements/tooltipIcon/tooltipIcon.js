import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { TooltipIconWrapper } from './tooltipIcon.style';
import Button from '../button';

class TooltipIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    size: 'normal',
    className: '',
  };

  render() {
    const { className = '', ...props } = this.props;

    return (
      <TooltipIconWrapper
        className={`tooltipIcon-wrapper ${className}`}
        {...props}
      >
        <Button>
          <Icon type="info" />
        </Button>
      </TooltipIconWrapper>
    );
  }
}

export default TooltipIcon;
