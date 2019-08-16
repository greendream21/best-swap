import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../../components/utility/contentView';

export const ContentWrapper = styled(ContentView)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;

  & > .ant-row {
    display: flex;
  }

  .trade-asset-status-row {
    display: flex;
    align-items: center;
    height: 90px;
    padding: 20px 20px !important;
    border-bottom: 1px solid ${palette('border', 0)};

    .coin-wrapper {
      margin: 0 20px;
    }

    .status-wrapper {
      width: 100px;
      margin-right: 30px;
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
