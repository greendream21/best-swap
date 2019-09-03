import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';

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
      padding-top: 20px;

      .label-wrapper {
        width: 130px;
        padding-top: 14px;
      }

      .ant-form-item {
        flex-grow: 1;
        height: 60px;
        .ant-form-explain {
          font-size: 12px;
        }
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

export const SwapModal = styled(Modal)`
  &.ant-modal {
    width: 700px !important;

    .ant-modal-body {
      height: 320px !important;
    }
  }
`;

export const SwapModalContent = styled.div`
  display: flex;
  justify-content: space-between;

  .coinData-wrapper {
    padding-left: 0;
    padding-bottom: 4px;
  }

  .status-wrapper {
    .status-title {
      padding-top: 0;
    }
    .status-value {
      padding-bottom: 0;
    }
  }

  .left-container {
    display: flex;
    flex-direction: column;
  }

  .center-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .label-wrapper {
      margin-top: 35px;
      text-transform: uppercase;
    }

    .before-start-label {
      opacity: 0;
    }
  }

  .right-container {
    display: flex;
    flex-direction: column;

    .expected-status {
      display: flex;

      .status-item {
        display: flex;
        flex-direction: column;
        padding-right: 8px;

        .price-label {
          padding-top: 4px;
          padding-bottom: 0;
        }
      }
    }
  }
`;
