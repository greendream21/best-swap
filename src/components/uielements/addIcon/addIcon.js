import React, { Component } from 'react';

import { IconWrapper } from './addIcon.style';

class AddIcon extends Component {
  render() {
    const { ...otherProps } = this.props;
    return (
      <IconWrapper {...otherProps}>
        <span>+</span>
      </IconWrapper>
    );
  }
}

export default AddIcon;
