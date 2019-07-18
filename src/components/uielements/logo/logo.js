import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LogoWrapper } from './logo.style';
import { logoData } from './data';

class Logo extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'long',
  };

  render() {
    const { name, type, ...otherProps } = this.props;
    const logoURL = logoData[name][type];

    return (
      <LogoWrapper {...otherProps}>
        <img src={logoURL} alt="bepswap-logo" />
      </LogoWrapper>
    );
  }
}

export default Logo;
