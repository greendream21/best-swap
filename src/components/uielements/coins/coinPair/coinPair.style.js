import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinPairWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .coin-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .arrow-icon {
    margin: 15px 15px;
    color: ${palette('text', 5)};
  }
`;
