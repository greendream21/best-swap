import styled from 'styled-components';
// import { palette } from 'styled-theme';
import ViewPanel from '../../components/viewPanel';

export const WalletViewWrapper = styled(ViewPanel)`
  height: 100%;

  .ant-tabs {
    height: 100%;
    .ant-tabs-content {
      height: 100%;
      .ant-tabs-tabpane {
        height: 100%;
      }
    }
  }

  .asset-title-label,
  button {
    margin-left: 20px;
  }

  .asset-title-label {
    padding-top: 40px;
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
`;
