import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';
import UnstyledTabs from '../../../components/uielements/tabs';

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  & > .ant-row {
    display: flex;
  }

  .stake-status-view {
    height: 150px;
    padding: 20px 0;
    border-bottom: 1px solid ${palette('border', 0)};

    .stake-pool-col {
      display: flex;
      justify-content: center;
      align-items: center;
      .stake-pool-status {
        width: 150px;
        padding: 0 15px;
        .status-value {
          font-weight: bold;
          font-size: ${key('sizes.font.big', '10px')};
        }
      }
    }

    .stake-info-col {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .stake-info-status {
        width: 25%;
      }
    }
  }

  .share-view {
    flex-grow: 1;

    .your-share-view,
    .share-detail-view {
      .label-title {
        padding-bottom: 0;
        letter-spacing: 2.5px;
      }
      .go-back {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        letter-spacing: 2.5px;

        i {
          padding-right: 8px;
          font-size: 16px;
        }
      }

      .withdraw-percent-view {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 5px;
        .label-wrapper {
          width: 40px;
        }
      }

      .stake-withdraw-info-wrapper {
        display: flex;
        flex-direction: column;

        .withdraw-status-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .withdraw-asset-wrapper {
            display: flex;
            flex-direction: column;

            .coinData-wrapper {
              padding: 10px 0;
            }
          }

          .drag-wrapper {
            padding-right: 20px;
          }
        }
      }
    }

    .your-share-view {
      display: flex;
      flex-direction: column;
      border-right: 1px solid ${palette('border', 0)};

      .btn-wrapper {
        width: 125px;
        margin-top: 10px;
      }

      .right-arrow-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding-top: 30px;
      }

      .your-share-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px 20px;

        .your-share-info-wrapper {
          display: flex;
          align-items: baseline;
          padding-bottom: 5px;

          .your-share-info {
            display: flex;
            flex-direction: column;
            margin-right: 20px;
            min-width: 90px;

            .status-title,
            .status-value {
              padding: 3px 0;
            }
            .your-share-price-label {
              padding: 0;
            }
          }
        }
      }

      .withdraw-view-wrapper {
        display: flex;
        flex-direction: column;
        border-top: 1px solid ${palette('border', 0)};
        padding-right: 20px;
        padding-bottom: 10px;
        padding-left: 20px;
      }
    }

    .share-detail-view {
      padding: 0;
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

      .stake-share-info-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;

        .status-wrapper {
          margin-right: 30px;
        }

        .pool-status-wrapper {
          display: flex;
          align-items: center;
        }

        .share-status-wrapper {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;

          .info-status-wrapper {
            display: flex;
            align-items: center;
            flex-grow: 1;
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

export const ConfirmModal = styled(Modal)`
  &.ant-modal {
    width: 700px !important;

    .ant-modal-body {
      height: 320px !important;
    }
  }
`;

export const ConfirmModalContent = styled.div`
  display: flex;
  justify-content: space-between;

  .left-container,
  .right-container {
    width: 250px;
  }

  .coinData-wrapper {
    width: 200px;
    padding-left: 0;
    padding-bottom: 8px;
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
    width: 200px;

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
    padding-left: 20px;
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

export const Tabs = styled(UnstyledTabs)`
  width: 100%;
  .ant-tabs-tabpane {
    padding: 0 20px;
  }
`;
