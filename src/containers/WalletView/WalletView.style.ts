import styled from 'styled-components';
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

  .asset-title-label {
    text-align: center;
    text-transform: uppercase;
    color: #626d7c;
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
