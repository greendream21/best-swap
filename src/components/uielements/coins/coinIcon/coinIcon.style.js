import styled from 'styled-components';
import { key } from 'styled-theme';

const sizes = {
  small: key('sizes.coin.small', '20px'),
  big: key('sizes.coin.big', '30px'),
};

export const CoinIconWrapper = styled.div`
  img {
    width: ${props => sizes[props.size]};
    height: ${props => sizes[props.size]};
  }
`;
