import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '../../../../settings/style-util';

export const CoinListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .coinList-row {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${props => (props.size === 'small' ? '54px' : '74px')};
    background-color: #fff;
    cursor: pointer;
    ${transition()};

    &.active,
    &:hover {
      background-color: ${palette('primary', 3)};
    }
  }
`;
