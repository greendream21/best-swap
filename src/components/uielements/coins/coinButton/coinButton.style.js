import styled from 'styled-components';
import Button from '../../button';

export const CoinButtonWrapper = styled(Button)`
  width: 110px;
  height: 50px;
  padding: 0 10px;
  flex-direction: ${props => (props.reversed ? 'row-reverse' : 'reverse')};

  span {
    letter-spacing: 1px;
  }
`;
