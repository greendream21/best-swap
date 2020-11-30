import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { logoData } from './data';
import { LogoWrapper } from './logo.style';

class Logo extends Component {
  render() {
    const { name, type, ...otherProps } = this.props;
    const LogoIcon = logoData[name][type];

    return (
      <LogoWrapper className="logo-wrapper" {...otherProps}>
        <LogoIcon />
      </LogoWrapper>
    );
  }
}

Logo.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Logo.defaultProps = {
  type: 'long',
};

export default Logo;
