import styled from 'styled-components';
import { palette } from 'styled-theme';

export const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #fff;
  color: ${palette('primary', 0)};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;

  span {
    position: relative;
    top: -2px;
    left: 8px;
    font-size: 24px;
    &::selection {
      background-color: transparent;
      color: ${palette('primary', 0)};
    }
  }
`;
