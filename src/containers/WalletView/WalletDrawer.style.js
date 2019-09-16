import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Drawer as AntdDrawer } from 'antd';

export const WalletDrawerWrapper = styled.div`
  position: relative;
  padding: 8px 4px;
`;

export const Drawer = styled(AntdDrawer)`
  height: 100%;

  .ant-drawer-body {
    height: 100%;
    padding: 24px 12px;
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
  }

  .forget-btn {
    position: absolute;
    bottom: 24px;
    left: 24px;
  }
`;
