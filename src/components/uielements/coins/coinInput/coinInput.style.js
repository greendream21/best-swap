import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinInputWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .title-label,
  .amount-label {
  }

  .coin-button {
    min-width: 150px;
    width: 150px;
    margin-bottom: 20px;
  }

  .amount-wrapper {
    display: flex;
    align-items: center;

    .asset-name-label {
      margin-left: 4px;
      text-transform: uppercase;
    }
  }
`;
