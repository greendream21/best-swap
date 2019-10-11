import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';

export const ContentWrapper = styled(ContentView)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;

  & > .ant-row {
    display: flex;
  }

  .trade-logos {
    .ant-col {
      display: flex;
      justify-content: center;
      align-items: center;

      &:first-child {
        border-right: 1px solid ${palette('border', 0)};
      }

      .logo-wrapper {
        width: 170px;
      }
    }
  }

  .trade-detail-row {
    flex-grow: 1;

    .trade-detail-panel {
      display: flex;
      flex-direction: column;
      padding: 10px 20px !important;
      border-right: 1px solid ${palette('border', 0)};

      .trade-asset-card-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .trade-asset-card {
          height: 150px;
          .trade-asset-slider {
            padding: 10px 0;
          }
        }
      }
      .drag-confirm-wrapper {
        display: flex;
        justify-content: center;
        padding-top: 40px;
      }
    }

    .trade-info-wrapper {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 20px;

      .status-wrapper {
        width: 50%;
      }
    }
  }
`;

export const TradeModal = styled(Modal)`
  &.ant-modal {
    width: 700px !important;

    .ant-modal-body {
      height: 320px !important;
    }
  }
`;

export const TradeModalContent = styled.div`
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
