import styled from 'styled-components';
import { Drawer as AntdDrawer } from 'antd';

export const WalletDrawerWrapper = styled.div`
  position: relative;
  padding: 8px 4px;
`;

export const Drawer = styled(AntdDrawer)`
  height: 100%;

  .forget-btn {
    position: absolute;
    bottom: 24px;
    left: 24px;
  }
`;
