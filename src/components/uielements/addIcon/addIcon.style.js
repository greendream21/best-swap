import styled from 'styled-components';
import { palette } from 'styled-theme';

export const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  color: ${palette('text', 3)};
  background: ${palette('primary', 0)};
  cursor: pointer;

  span {
    position: relative;
    top: -6px;
    left: 4px;
    font-size: 20px;
    &::selection {
      background-color: transparent;
      color: ${palette('text', 3)};
    }
  }
`;
