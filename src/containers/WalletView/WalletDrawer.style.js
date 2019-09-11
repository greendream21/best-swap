import styled from 'styled-components';
import { Drawer as AntdDrawer } from 'antd';

export const WalletDrawerWrapper = styled.div`
  position: relative;
  padding: 8px 4px;
`;

export const Drawer = styled(AntdDrawer)`
  height: 100%;

  .wallet-address {
    position: absolute;
    bottom: 70px;
    left: 24px;
    display: flex;
    align-items: center;

    i {
      margin-right: 4px;
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
