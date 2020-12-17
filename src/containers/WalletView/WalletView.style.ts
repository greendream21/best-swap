import styled from 'styled-components';
import { palette } from 'styled-theme';

import ViewPanel from '../../components/viewPanel';

export const WalletViewWrapper = styled(ViewPanel)`
  height: 100%;

  .ant-tabs {
    height: 100%;

    .ant-tabs-nav-scroll {
      display: flex;
      justify-content: center;
    }
    .ant-tabs-content {
      height: 100%;
      .ant-tabs-tabpane {
        height: 100%;
      }
    }
  }

  .asset-title-label {
    text-align: center;
    text-transform: uppercase;
    color: ${palette('text', 1)};
  }

  .coinList-wrapper {
    height: calc(100% - 200px);
    overflow-y: auto;
    margin: 0 10px;

    .coinList-row {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  .asset-price-info {
    display: none !important;
  }
`;

export const LoaderWrapper = styled.div`
  text-align: center;
  border-radius: 4px;
  margin: 20px 0;
  height: 100%;
`;
