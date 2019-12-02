import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinWrapper = styled.div`
  width: ${props => (props.size === 'small' ? '32px' : '40px')};
  height: ${props => (props.size === 'small' ? '32px' : '40px')};
  border-radius: 50%;
  box-shadow: 0px 4px 5px ${palette('primary', 3)};

  .coinIcon-wrapper {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
`;

export const CoinsWrapper = styled.div`
  position: relative;
  min-width: ${props => (props.size === 'small' ? '64px' : '88px')};
  display: flex;
  align-items: center;

  .coin-bottom,
  .coin-over {
    width: ${props => (props.size === 'small' ? '32px' : '40px')};
    height: ${props => (props.size === 'small' ? '32px' : '40px')};
    position: relative;
    border-radius: 50%;
    box-shadow: 0px 4px 5px ${palette('primary', 3)};
    background-color: #fff;

    .coinIcon-wrapper {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .dynamic-bottom,
  .dynamic-over {
    position: relative;
    box-shadow: 0px 4px 5px ${palette('primary', 3)};
  }

  .coin-over,
  .dynamic-over {
    position: relative;
    left: ${props => (props.size === 'small' ? '-12px' : '-16px')};
  }
`;
