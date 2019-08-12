import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinCardWrapper = styled.div`
  .title-label {
    font-style: italic;
  }
  .card-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 250px;
    height: 75px;
    padding: 10px 10px;
    border: 1px solid ${palette('border', 0)};
    border-radius: 5px;
    background-color: #fff;

    .asset-data {
      display: flex;
      flex-direction: column;
      width: 140px;

      .ant-divider {
        margin: 2px 0;
      }

      .label-wrapper {
        padding: 0;
      }

      .asset-name-label {
        text-transform: uppercase;
        padding-bottom: 5px;
      }

      .asset-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .selection-wrapper {
    width: 250px;
    margin-top: 10px;

    .btn-wrapper {
      width: 55px;
    }
  }
`;
