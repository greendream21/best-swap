import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Logo from '../uielements/logo';
import { StyledHeader } from './header.style';
import HeaderSetting from './headerSetting';

class Header extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const { title } = this.props;

    return (
      <StyledHeader>
        <Logo className="header-logo" name="bepswap" type="long" />
        <p className="header-title">{title}</p>
        <div className="header-right">
          <HeaderSetting />
        </div>
      </StyledHeader>
    );
  }
}

export default Header;
