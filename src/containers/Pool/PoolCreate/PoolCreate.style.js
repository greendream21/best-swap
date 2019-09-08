import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

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
