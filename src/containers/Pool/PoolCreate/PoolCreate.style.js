import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';
import { media } from '../../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  & > .ant-row {
    display: flex;
  }

  .pool-new-row {
    display: flex;
    flex: auto;

    .label-title {
      padding-bottom: 0;
      letter-spacing: 2.5px;
    }

    .token-details-view {
      display: flex;
      flex-direction: column;
      padding: 10px 20px;
      border-right: 1px solid ${palette('border', 0)};

      .new-token-coin {
        padding-top: 20px;
        padding-bottom: 10px;
      }

      .status-wrapper {
        .status-title {
          padding-top: 5px;
        }
        .status-value {
          padding-bottom: 5px;
        }
      }

      .left-arrow-wrapper {
        display: flex;
        justify-content: left;
        align-items: center;
        flex-grow: 1;
        padding-left: 20px;

        img {
          transform: rotate(180deg);
        }
      }
    }

    .add-asset-view {
      display: flex;
      flex-direction: column;
      padding: 10px 20px;

      .label-no-padding {
        padding: 0;
      }
      .label-description {
        padding-bottom: 0;
      }

      .stake-card-wrapper {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 15px 0;

        .coinCard-wrapper {
          width: calc(50% - 20px);
        }
      }

      .slider-wrapper {
        width: 100%;
      }

      .create-pool-info-wrapper {
        display: flex;
        flex: auto;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;

        .create-token-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;

          .info-status-wrapper {
            display: flex;
            align-items: center;
            flex-grow: 1;

            .status-wrapper {
              margin-right: 30px;
            }
          }

          .drag-wrapper {
            padding-top: 24px;
            padding-right: 24px;
          }
        }
      }
    }
  }
`;

// Needs to be rewritten as a reusable component

export const PrivateModal = styled(Modal)`
  .ant-modal-body {
    .ant-form-item {
      margin-bottom: 0;
    }
  }
`;

export const ConfirmModal = styled(Modal)`
  &.ant-modal {
    width: 420px !important;

    .ant-modal-body {
      padding: 0px;
    }
  }
`;

export const ConfirmModalContent = styled.div`
  ${media.lg`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 30px 0;
    border-bottom: 1px solid ${palette('border', 0)};

    .coinData-wrapper {
      padding-left: 0;
      padding-bottom: 4px;
      margin-left: 14px;
    }

    .status-wrapper {
      .status-title {
        ${media.lg`
        padding-top: 0;
      `}
      }
      .status-value {
        ${media.lg`
        padding-bottom: 0;
      `}
      }
    }

    .timer-container {
      ${media.lg`
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 30px;
        `}
    }

    .coin-data-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      .coin-data-container {
        display: flex;
        flex-direction: column;

        .coinData-wrapper {
          &:first-child {
            padding-bottom: 20px;
          }
        }
      }
    }
  }

  .modal-info-wrapper {
    padding: 20px 0;

    .hash-address {
      display: flex;
      align-items: center;

      .copy-btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px solid ${palette('primary', 0)};
        border-radius: 6px;
        padding: 1px 4px;
        margin-right: 6px;
        color: ${palette('primary', 0)};
        cursor: pointer;

        .view-btn {
          width: 300px;
          height: 40px;
          margin: 24px 0;
        }
      }

      .label-wrapper {
        width: 100%;
      }
    }
  }
`;
