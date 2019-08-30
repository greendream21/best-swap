import styled from 'styled-components';
import { palette, key } from 'styled-theme';

const sizes = {
  small: key('sizes.coin.small', '20px'),
  big: key('sizes.coin.big', '30px'),
};

export const CoinIconWrapper = styled.div`
  width: ${props => sizes[props.size]};
  height: ${props => sizes[props.size]};
  img {
    width: ${props => sizes[props.size]};
    height: ${props => sizes[props.size]};
    border-radius: 50%;
  }

  .blue-circle {
    width: ${props => sizes[props.size]};
    height: ${props => sizes[props.size]};
    background-color: ${palette('primary', 0)};
    border-radius: 50%;
  }
  .confirm-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => sizes[props.size]};
    height: ${props => sizes[props.size]};
    background-color: ${palette('success', 0)};
    border-radius: 50%;
    i {
      color: white;
    }
  }
`;
