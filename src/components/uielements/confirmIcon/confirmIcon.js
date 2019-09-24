import React, { Component } from 'react';
import { Icon } from 'antd';
import { IconWrapper } from './confirmIcon.style';

class ConfirmIcon extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { className, ...otherProps } = this.props;
    return (
      <IconWrapper className={className} {...otherProps}>
        <Icon type="check" />
      </IconWrapper>
    );
  }
}

export default ConfirmIcon;
