import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CoinWrapper = styled.div`
  border-radius: 50%;
  box-shadow: 0px 0px 4px 0.5px ${palette('secondary', 2)};
  padding: ${props => (props.size === 'small' ? '6px' : '8px')}
    ${props => (props.size === 'small' ? '6px' : '8px')};
`;
