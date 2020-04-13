import styled from 'styled-components';

type CoinInputWrapperProps = {
  reverse: boolean;
};

export const CoinInputWrapper = styled.div<CoinInputWrapperProps>`
  display: flex;
  flex-direction: column;

  .title-label,
  .amount-label,
  .asset-price-label,
  .coin-button-wrapper,
  .amount-wrapper {
    display: flex;
    flex-direction: ${props => (props.reverse ? 'row-reverse' : 'row')};
  }

  .amount-label {
    padding-bottom: 0px;
  }

  .coin-button {
    min-width: 150px;
    width: 150px;
    margin-bottom: 10px;
  }

  .amount-wrapper {
    display: flex;
    align-items: center;

    .asset-amount-input {
      min-width: 150px;
      width: 150px;
    }

    .asset-name-label {
      margin: 0 4px;
      text-transform: uppercase;
    }
  }

  .asset-price-label {
    padding-top: 0px;
  }
`;
