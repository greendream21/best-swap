import styled from 'styled-components';
import { ButtonProps } from 'antd/lib/button';
import Button from '../../button';

type CoinButtonWrapperProps = {
  reversed: boolean;
};

type Props = CoinButtonWrapperProps & ButtonProps;

export const CoinButtonWrapper = styled(Button)<Props>`
  width: 166px;
  padding: 0 10px;
  flex-direction: column;

  .coinButton-content {
    display: flex;
    flex-direction: ${props => (props.reversed ? 'row-reverse' : 'reverse')};
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;

    .coin-value {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      padding-left: 12px;

      .label-wrapper {
        padding: 0;
      }
    }
  }

  span {
    letter-spacing: 1px;
  }
`;
