import React, { Component } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { IconWrapper } from './confirmIcon.style';

class ConfirmIcon extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { className, ...otherProps } = this.props;
    return (
      <IconWrapper className={className} {...otherProps}>
        <CheckOutlined />
      </IconWrapper>
    );
  }
}

export default ConfirmIcon;
