import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { TooltipIconWrapper } from './tooltipIcon.style';
import Button from '../button';

class TooltipIcon extends Component {
  static propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    text: '',
    size: 'normal',
    className: '',
  };

  render() {
    const { text, className = '', ...props } = this.props;

    const tooltipContent = (
      <div style={{ width: '200px', fontFamily: 'Montserrat' }}>{text}</div>
    );

    return (
      <TooltipIconWrapper
        content={tooltipContent}
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
