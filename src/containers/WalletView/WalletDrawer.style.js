import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Drawer as AntdDrawer } from 'antd';
import { media } from '../../helpers/styleHelper';

export const WalletDrawerWrapper = styled.div`
  position: relative;
  padding: 8px 4px;

  .wallet-mobile-btn {
    position: fixed;
    top: 26px;
    right: 8px;
    display: block;
    width: 30px;
    height: 30px;
    min-width: 30px;
    border-radius: 50%;
    border: 1px solid ${palette('primary', 1)};
    padding: 4px 7px;
    color: ${palette('primary', 1)};
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
    top: 85px;
    left: 24px;
    display: flex;
    align-items: center;
    z-index: 999;

    .copy-btn-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px solid ${palette('primary', 0)};
      border-radius: 4px;
      padding: 4px;
      margin-right: 6px;
      color: ${palette('primary', 0)};
      cursor: pointer;
    }

    .label-wrapper {
      width: 100%;
    }

    .wallet-label-wrapper {
      word-break: break-word;
      max-width: 180px;
      padding: 4px;
    }
  }

  .forget-btn {
    position: absolute;
    bottom: 24px;
    left: 24px;
  }
`;
