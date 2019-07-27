import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinDataWrapper = styled.div`
  display: flex;
  align-items: ${props =>
    props.assetValue && props.size === 'small' ? 'flex-end' : 'center'};
  width: 100%;
  padding: 0 8px;

  .label-wrapper {
    padding: 0;
    text-transform: uppercase;
  }

  .coinData-coin-avatar {
    margin-right: ${props => (props.target ? '0px' : '12px')};
  }

  .coinData-asset-info {
    margin-left: ${props => (props.target ? '0px' : '4px')} !important;
  }

  .coinData-asset-info,
  .coinData-target-info {
    display: flex;
    flex-direction: column;
    margin: 0 4px;
  }

  .asset-price-info {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;

    ${props => props.size === 'big' && 'height: 32px;'}
    .label-wrapper {
      ${props =>
        props.size === 'big' &&
        `display: flex;
          align-items: flex-end;`}
    }
  }
`;
