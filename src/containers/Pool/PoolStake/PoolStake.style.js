import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

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
        width: 100px;
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

      .stake-share-info-wrapper {
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
      }
    }
  }
`;
