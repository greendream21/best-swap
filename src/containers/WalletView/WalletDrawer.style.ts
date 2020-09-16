import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Drawer as AntdDrawer } from 'antd';
import { media } from '../../helpers/styleHelper';

export const WalletDrawerWrapper = styled.div`
  position: relative;
  padding: 8px 4px;

  .wallet-mobile-btn {
    width: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 50%;
    border: 1px solid ${palette('primary', 0)};
    padding: 4px 7px;
    color: ${palette('primary', 0)};
    ${media.sm`
      display: none;
    `}
  }
`;

export const Drawer = styled(AntdDrawer)`
  height: 100%;

  .ant-drawer-body {
    height: 100%;
    padding: 24px 12px;
    background-color: ${palette('background', 1)};
  }

  .ant-tabs-bar {
    margin-bottom: 0;
  }

  .ant-tabs-nav {
    padding-left: 50px;
  }

  .refresh-balance-icon {
    position: absolute;
    top: 15px;
    right: 24px;
    color: ${palette('primary', 0)};
    z-index: 999;
    cursor: pointer;
  }

  .wallet-address {
    position: absolute;
    bottom: 35px;
    left: 34px;
    width: 80%;
    display: flex;
    align-items: center;
    z-index: 999;
    border: 0.5px solid ${palette('gray', 0)};
    border-radius: 4px;

    .copy-btn-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36px;

      padding: 4px;
      margin-right: 6px;
      font-size: 12px;
      color: ${palette('primary', 0)};
      background: ${palette('background', 2)};
      border-radius: 4px;
      cursor: pointer;
    }

    .label-wrapper {
      width: 100%;
    }

    .wallet-label-wrapper {
      word-break: break-word;
      padding: 4px;
    }
  }

  .wallet-drawer-tools {
    position: absolute;
    bottom: 94px;
    left: 34px;
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn-wrapper {
      width: 46%;
    }
  }
`;
