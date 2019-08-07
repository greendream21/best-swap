import styled from 'styled-components';
import { size, key, palette } from 'styled-theme';

export const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100vw;
  height: ${size('footerHeight', '50px')};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 30px;
  background-color: ${palette('background', 0)};

  .footer-logo {
    cursor: pointer;
    img {
      height: 30px;
    }
  }
  .footer-links-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 280px;

    a {
      font-family: 'Montserrat Bold';
      font-size: ${key('sizes.font.normal', '12px')};
      color: ${palette('text', 6)};
      letter-spacing: 1px;
      cursor: pointer;
    }
  }
  .footer-social-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 200px;

    a {
      font-size: 18px;
      color: ${palette('text', 6)};
      cursor: pointer;
    }
  }
`;
