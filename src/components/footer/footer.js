import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';

import Logo from '../uielements/logo';
import { StyledFooter } from './footer.style';

class Footer extends Component {
  render() {
    return (
      <StyledFooter>
        <Logo className="footer-logo" name="thorchain" type="long" />
        <div className="footer-links-bar">
          <Link to="stats">STATS</Link>
          <Link to="network">NETWORK</Link>
          <Link to="faqs">FAQS</Link>
        </div>
        <div className="footer-social-bar">
          <div>
            <Icon type="facebook" />
          </div>
          <div>
            <Icon type="twitter" />
          </div>
          <div>
            <Icon type="youtube" />
          </div>
          <div>
            <Icon type="instagram" />
          </div>
          <div>
            <Icon type="github" />
          </div>
        </div>
      </StyledFooter>
    );
  }
}

export default Footer;
