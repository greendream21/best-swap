import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { TooltipIconWrapper } from './tooltipIcon.style';
import Button from '../button';

class TooltipIcon extends Component {
  render() {
    const { text, className = '', ...props } = this.props;

    const tooltipContent = (
      <div style={{ width: '150px', fontFamily: 'Montserrat' }}>{text}</div>
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

TooltipIcon.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

TooltipIcon.defaultProps = {
  text: '',
  size: 'normal',
  className: '',
};

export default TooltipIcon;
