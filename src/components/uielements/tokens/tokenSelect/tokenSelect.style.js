import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '../../../../settings/style-util';

export const TokenSelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 196px;
  height: 60px;
  border: 1px solid ${palette('border', 0)};
  border-radius: 2px;
  text-transform: uppercase;
  ${transition()};
`;
