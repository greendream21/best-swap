import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import { TelegramIcon } from '../icons/telegramicon';

import Logo from '../uielements/logo';
import { StyledFooter, FooterContainer, FooterItem } from './footer.style';
import { Maybe } from '../../types/bepswap';

type Props = {
  commitHash: Maybe<string>
};

const Footer: React.FC<Props> = ({ commitHash }): JSX.Element => {
  return (
    <FooterContainer>
      <StyledFooter>
        <FooterItem>
          <a
            href="https://thorchain.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Logo className="footer-logo" name="thorchain" type="long" />
          </a>
        </FooterItem>
        <FooterItem>
          <div className="footer-links-bar">
            {/* <Link to="/stats">STATS</Link> */}
            <Link to="/tutorial">TUTORIAL</Link>
            <Link to="/faqs">FAQS</Link>
          </div>
        </FooterItem>
        <FooterItem>
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
              href="https://t.me/thorchain_org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon component={TelegramIcon} />
            </a>
            <a
              href="https://github.com/thorchain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon type="github" />
            </a>
            {commitHash && (
              <a
                href={`https://gitlab.com/thorchain/bepswap/bepswap-web-ui/-/commit/${commitHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon type="branches" />
              </a>
            )}
          </div>
        </FooterItem>
      </StyledFooter>
    </FooterContainer>
  );
};

export default Footer;
