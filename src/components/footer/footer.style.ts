import { transparentize } from 'polished';
import styled from 'styled-components';
import { size, key, palette } from 'styled-theme';

import { media } from 'helpers/styleHelper';

export const FooterItem = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .footer-logo {
    #Thorchain_logo-copy {
      > :not(:first-child) {
        fill: ${palette('text', 1)};
      }
    }
  }
`;

export const FooterContainer = styled.div`
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `linear-gradient(0deg, ${transparentize(
      0.85,
      '#23DCC8',
    )} 0%, ${transparentize(1, theme.palette.background[0])} 100%)`};


  padding: 0;

  ${media.sm`
    padding: 12px 0px;
  `}
`;

export const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 10px 10px;

  ${media.md`
    padding: 40px 20px;
  `}


  > ${FooterItem} {
    margin-bottom: 20px;
  }

  ${media.md`
    > ${FooterItem} {
      margin-bottom: 0;
    }
    flex-direction: row;

    z-index: 1000;
    height: ${size('footerHeight', '50px')};
    padding: 0 30px;
  `}

  background-color: transparent;

  /* TODO: Refactor these to avoid using classnames */
  .footer-logo {
    cursor: pointer;
  }

  .footer-links-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      font-size: ${key('sizes.font.normal', '12px')};
      font-weight: bold;
      color: ${palette('text', 1)};
      letter-spacing: 1px;
      cursor: pointer;
      padding-left: 8px;

      ${media.md`
        padding-left: 50px;
      `};
    }
    a:first-child {
      padding-left: 0;
    }
  }
  .footer-social-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 200px;

    a {
      font-size: 18px;
      color: ${palette('text', 1)};
      cursor: pointer;
    }
  }
`;
