import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

import Logo from '../uielements/logo';
import { StyledFooter } from './footer.style';

class Footer extends Component {
  render() {
    return (
      <StyledFooter>
        <a
          href="https://thorchain.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Logo className="footer-logo" name="thorchain" type="long" />
        </a>
        <div className="footer-links-bar">
          <Link to="stats">STATS</Link>
          <Link to="network">NETWORK</Link>
          <Link to="tutorial">TUTORIAL</Link>
          <Link to="faqs">FAQS</Link>
        </div>
        <div className="footer-social-bar">
          <a
            href="https://twitter.com/thorchain_org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon type="twitter" />
          </a>
          <a
            href="https://reddit.com/r/thorchain"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon type="reddit" />
          </a>
          <a
            href="https://medium.com/thorchain"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon type="medium" />
          </a>
          <a
            href="https://github.com/thorchain"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon type="github" />
          </a>
        </div>
      </StyledFooter>
    );
  }
}

export default Footer;
