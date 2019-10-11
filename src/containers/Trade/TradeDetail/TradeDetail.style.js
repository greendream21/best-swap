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

  .trade-values {
    & > .ant-col {
      display: flex;
      justify-content: space-around;
      align-items: center;

      & > div {
        width: 350px;
      }

      .trade-price-analysis {
        padding: 20px;
        border: 1px solid ${palette('border', 0)};
        border-radius: 4px;

        .trade-move-value {
          padding: 0;
        }
      }
    }
  }

  .trade-panel {
    .ant-col {
      display: flex;
      justify-content: space-around;
      align-items: center;

      &:first-child {
        border-right: 1px solid ${palette('border', 0)};
      }

      .trade-card {
        .slider-wrapper {
          margin: 20px 0;
        }
      }
      .trade-btn {
        margin: 0 40px;
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
