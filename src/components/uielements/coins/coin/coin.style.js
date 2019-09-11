import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinWrapper = styled.div`
  width: ${props => (props.size === 'small' ? '32px' : '44px')};
  height: ${props => (props.size === 'small' ? '32px' : '44px')};
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0.5px ${palette('secondary', 2)};
  padding: ${props => (props.size === 'small' ? '6px' : '8px')}
    ${props => (props.size === 'small' ? '6px' : '8px')};

  .coinIcon-wrapper {
    position: relative;
    top: -1px;
  }
`;

export const CoinsWrapper = styled.div`
  position: relative;
  min-width: ${props => (props.size === 'small' ? '64px' : '88px')};
  display: flex;
  align-items: center;

  .coin-bottom,
  .coin-over {
    position: relative;
    top: -1px;
    border-radius: 50%;
    box-shadow: 0px 0px 4px 0.5px ${palette('secondary', 2)};
    background-color: #fff;
    padding: ${props => (props.size === 'small' ? '6px' : '8px')}
      ${props => (props.size === 'small' ? '6px' : '8px')};
  }

  .dynamic-bottom,
  .dynamic-over {
    position: relative;
    top: -1px;
    box-shadow: 0px 0px 4px 0.5px ${palette('secondary', 2)};
  }

  .coin-over,
  .dynamic-over {
    position: relative;
    left: ${props => (props.size === 'small' ? '-12px' : '-16px')};
  }
`;
