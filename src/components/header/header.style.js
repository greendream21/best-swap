import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';

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
  background-color: ${palette('background', 0)};

  .header-logo {
    cursor: pointer;
    img {
      height: 24px;
    }
  }

  .header-title {
    color: ${palette('text', 1)};
    font-size: ${key('sizes.font.big', '15px')};
    letter-spacing: 0.9px;
  }

  .ant-dropdown-link {
    display: flex;
    align-items: center;
    color: ${palette('text', 1)};
    font-weight: bold;
    i {
      padding: 0 5px;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .txView-wrapper {
      margin-left: 10px;
    }
  }
`;
