import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  & > .ant-row {
    display: flex;
    flex: auto;
  }

  .swap-detail-panel {
    display: flex;
    flex-direction: column;
    padding: 20px 20px !important;
    border-right: 1px solid ${palette('border', 0)};

    .swap-type-selector {
      display: flex;
      justify-content: space-between;

      .btn-wrapper {
        width: calc(50% - 10px);
      }
    }

    .recipient-form {
      display: flex;
      align-items: center;
      padding-top: 20px;

      .label-wrapper {
        width: 170px;
      }

      .input-wrapper {
        flex-grow: 1;
      }
    }
    .swap-asset-card {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
    }

    .drag-confirm-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 20px;
    }
  }

  .swap-token-panel {
    padding: 20px 20px !important;

    .token-search-input {
      margin: 10px 0;
    }

    .coinList-wrapper {
      .coinList-row {
        padding: 0;
      }
    }
  }
`;
