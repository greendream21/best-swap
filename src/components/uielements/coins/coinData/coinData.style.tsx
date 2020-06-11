import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Maybe } from '../../../../types/bepswap';

export type CoinDataWrapperSize = 'small' | 'big';
export type CoinDataWrapperType = 'wallet' | 'normal';

type CoinDataWrapperProps = {
  size: CoinDataWrapperSize;
  type: CoinDataWrapperType;
  target?: Maybe<string>;
};

export const CoinDataWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 8px;

  .label-wrapper {
    padding: 0;
    text-transform: uppercase;
  }

  .coinData-content {
    display: flex;
    align-items: center;
  }

  .coinData-coin-avatar {
    margin-right: ${(props: CoinDataWrapperProps) =>
      props.target ? '0px' : '4px'};
  }

  .coinData-info-wrapper {
    display: flex;
    flex-direction: column;
  }

  .coinData-asset-info {
    margin-left: ${(props: CoinDataWrapperProps) =>
      props.target ? '0px' : '4px'} !important;
  }

  .coinData-asset-info,
  .coinData-target-info {
    display: flex;
  }

  .asset-price-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    text-align: right;
    max-width: 100px;

    ${(props: CoinDataWrapperProps) => props.size === 'big' && 'height: 32px;'}
    .label-wrapper {
      &:last-child {
        margin-left: 4px;
      }

      ${(props: CoinDataWrapperProps) =>
        props.size === 'big' &&
        `display: flex;
          align-items: flex-end;`}
    }
  }

  .coinData-asset-label,
  .coinData-asset-value,
  .coinData-target-label,
  .coinData-target-value {
    color: ${palette('text', 0)};
  }

  .coinData-asset-label,
  .coinData-target-label {
    margin-right: 4px;
  }
`;
