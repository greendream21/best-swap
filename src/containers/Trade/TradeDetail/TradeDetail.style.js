import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';
import { media } from '../../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  .trade-logos {
    .ant-col {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;

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
      ${media.xs`
        flex-direction: column;
      `}
      ${media.lg`
        flex-direction: row;
      `}

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

  .trade-expectations {
    padding-bottom: 20px;

    & > .ant-col {
      display: flex;
      justify-content: space-around;
      align-items: center;

      & > div {
        width: 350px;
      }

      .trade-asset-container {
        padding: 20px;
        border: 2px solid ${palette('primary', 0)};
        border-radius: 4px;

        .coinData-wrapper {
          margin-bottom: 20px;
        }

        .label-wrapper {
          padding: 0;
        }
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
