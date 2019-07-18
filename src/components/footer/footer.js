import React, { Component } from 'react';
import { Icon } from 'antd';

import Logo from '../uielements/logo';
import { StyledFooter } from './footer.style';

class Footer extends Component {
  render() {
    return (
      <StyledFooter>
        <Logo className="footer-logo" name="thorchain" type="long" />
        <div className="footer-links-bar">
          <div>STATS</div>
          <div>NETWORK</div>
          <div>FAQS</div>
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
