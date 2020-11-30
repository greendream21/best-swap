import React, { Component } from 'react';

import { InfoOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Button from '../button';
import { TooltipIconWrapper } from './tooltipIcon.style';

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
          <InfoOutlined />
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
