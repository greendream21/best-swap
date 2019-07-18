import styled from 'styled-components';
import { size, key } from 'styled-theme';

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: ${size('headerHeight', '90px')};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 30px;
  background-color: #fff;

  .header-logo {
    cursor: pointer;
    img {
      height: 24px;
    }
  }
  .header-title {
    font-size: ${key('sizes.font.input', '11px')};
  }
`;
