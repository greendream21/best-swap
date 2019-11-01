import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';
import { media } from '../../helpers/styleHelper';

export const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: ${size('headerHeight', '70px')};

  padding: 0 10px;
  ${media.sm`
    padding: 0 20px;
    justify-content: space-between;
  `}

  > * {
    margin-right: 20px;
  }

  > *:last-child {
    margin-right: 0;
  }
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${palette('background', 0)};

  /* HACK: this override hack should be in the 
  dropdown component itself */
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

  .header-tab-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .ant-tabs-nav {
      padding: 0 10px;
      ${media.sm`
        padding: 0 25px;
      `}
    }

    .ant-tabs-tab {
      margin-right: 5px;
      ${media.sm`
        margin-right: 32px;
      `}
    }
  }
`;

export const LogoWrapper = styled.div`
  margin-right: 4px;
  display: none;
  ${media.sm`
    margin-right: 20px;
    display: flex;
  `}
  img {
    max-height: 24px;
  }
`;

export const HeaderTitle = styled.p`
  display: none;
  ${media.sm`
    display:block;
  `}
  color: ${palette('text', 1)};
  font-size: ${key('sizes.font.big', '15px')};
  letter-spacing: 0.9px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderActionButtons = styled.div`
  display: none;

  ${media.sm`
    display: flex;
    align-items: center;
  `}

  /* HACK: This should be refactored in 
     the future to not use classes */
  .wallet-btn-wrapper {
    margin-right: 14px;
  }

  .txView-wrapper {
    margin-left: 10px;
    align-items: center;
  }

  .ant-dropdown-link {
    margin: 0 8px;
  }
`;
