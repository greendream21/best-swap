import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';
import Modal from '../../../components/uielements/modal';
import { media } from '../../../helpers/styleHelper';

// TODO:
// This needs to be refactored/rewritten pretty badly
// We really must not use global classes for CSS we loose
// all the reuseability/modularity that CSS provides us
export const ContentWrapper = styled(ContentView)`
  padding: 0;

  .stake-status-view {
    ${media.lg`
      padding: 20px 0;
      border-bottom: 1px solid ${palette('border', 0)};
    `}

    .stake-pool-col {
      display: flex;
      padding: 20px;
      justify-content: flex-start;
      align-items: center;

      .stake-pool-status {
        ${media.lg`
          padding: 0 15px;
        `}

        .status-value {
          ${media.lg`
            font-weight: bold;
            font-size: ${key('sizes.font.big', '10px')};
          `}
        }
      }
    }

    .stake-info-col {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 20px;
      .stake-info-status {
        width: 50%;
        ${media.lg`
          width: 25%;
        `}
      }
    }
  }

  .share-view {
    ${media.lg`
      display:flex;
      flex-grow: 1;

      & > * {
        border-right: 1px solid ${palette('border', 0)};
        &:last-child {
          border-right: none;
        }
      }
    `}

    .your-share-view,
    .share-detail-view {
      .label-title {
        ${media.lg`
          padding-bottom: 0;
          letter-spacing: 2.5px;
        `}
      }
      .go-back {
        ${media.lg`
          display: flex;
          align-items: center;
          text-transform: uppercase;
          letter-spacing: 2.5px;
        `}

        i {
          ${media.lg`
            padding-right: 8px;
            font-size: 16px;
          `}
        }
      }

      .withdraw-percent-view {
        ${media.lg`
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 5px;
          .label-wrapper {
            width: 40px;
          }
        `}
      }

      .stake-withdraw-info-wrapper {
        ${media.lg`
          display: flex;
          flex-direction: column;
        `}

        .withdraw-status-wrapper {
          ${media.lg`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}

          .withdraw-asset-wrapper {
            ${media.lg`
              display: flex;
              flex-direction: column;
            `}

            .coinData-wrapper {
              ${media.lg`
                padding: 10px 0;
              `}
            }
          }

          .drag-wrapper {
            ${media.lg`
              padding-right: 20px;
            `}
          }
        }
      }
    }

    .your-share-view {
      ${media.lg`
        display: flex;
        flex-direction: column;
        
      `}

      .btn-wrapper {
        ${media.lg`
          width: 125px;
          margin-top: 10px;
        `}
      }

      .right-arrow-wrapper {
        ${media.lg`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          padding-top: 30px;
        `}
      }

      .your-share-wrapper {
        padding: 10px 20px;

        ${media.lg`
          display: flex;
          flex-direction: column;
        `}

        .your-share-info-wrapper {
          ${media.lg`
            display: flex;
            align-items: baseline;
            padding-bottom: 5px;
          `}

          .your-share-info {
            ${media.lg`
              display: flex;
              flex-direction: column;
              margin-right: 20px;
              min-width: 90px;
            `}

            .status-title,
            .status-value {
              ${media.lg`
                padding: 3px 0;
              `}
            }
            .your-share-price-label {
              ${media.lg`
                padding: 0;
              `}
            }
          }
        }
      }

      .withdraw-view-wrapper {
        ${media.lg`
          display: flex;
          flex-direction: column;
          border-top: 1px solid ${palette('border', 0)};
          padding-right: 20px;
          padding-bottom: 10px;
          padding-left: 20px;
        `}
      }
    }

    .share-detail-view {
      padding: 10px 20px;

      .label-no-padding {
        ${media.lg`
          padding: 0;
        `}
      }
      .label-description {
        ${media.lg`
          padding-bottom: 0;
        `}
      }

      .stake-card-wrapper {
        & > * {
          margin-bottom: 20px;
        }

        ${media.lg`
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 15px 0;
          & > * {
            margin-bottom: auto;
          }
        `}

        .coinCard-wrapper {
          ${media.lg`
            width: calc(50% - 20px);
          `}
        }
      }

      .slider-wrapper {
        ${media.lg`
          width: 100%;
        `}
      }

      .stake-share-info-wrapper {
        ${media.lg`
          display: flex;
          flex-direction: column;
          width: 100%;
        `}

        .status-wrapper {
          ${media.lg`
            margin-right: 30px;
          `}
        }

        .pool-status-wrapper {
          display: flex;
          > * {
            width: 50%;
          }

          ${media.lg`
            align-items: center;
            > * {
              width: auto;
            }
          `}
        }

        .share-status-wrapper {
          ${media.lg`
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          `}

          .info-status-wrapper {
            display: flex;

            & > * {
              width: 50%;
            }

            ${media.lg`
              align-items: center;
              flex-grow: 1;
              & > * {
                width: auto;
              }
            `}
          }

          .drag-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            ${media.lg`
              padding-top: 24px;
              padding-right: 24px;
            `}
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
      ${media.lg`
        height: 320px !important;
      `}
    }
  }
`;

export const ConfirmModalContent = styled.div`
  ${media.lg`
    display: flex;
    justify-content: space-between;
  `}

  .left-container,
  .right-container {
    ${media.lg`
      width: 250px;
    `}
  }

  .coinData-wrapper {
    ${media.lg`
      width: 200px;
      padding-left: 0;
      padding-bottom: 8px;
    `}
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

  .left-container {
    ${media.lg`
      display: flex;
      flex-direction: column;
    `}
  }

  .center-container {
    ${media.lg`
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 200px;
    `}

    .label-wrapper {
      ${media.lg`
        margin-top: 35px;
        text-transform: uppercase;
      `}
    }

    .before-start-label {
      ${media.lg`
        opacity: 0;
      `}
    }
  }

  .right-container {
    ${media.lg`
      display: flex;
      flex-direction: column;
      padding-left: 20px;
    `}

    .expected-status {
      ${media.lg`
        display: flex;
      `}

      .status-item {
        ${media.lg`  
          display: flex;
          flex-direction: column;
          padding-right: 8px;
        `}
        .price-label {
          ${media.lg`  
            padding-top: 4px;
            padding-bottom: 0;
          `}
        }
      }
    }
  }
`;
