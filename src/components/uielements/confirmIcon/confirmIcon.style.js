import styled from 'styled-components';
import { palette } from 'styled-theme';

export const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border: none;
  border-radius: 50%;
  background-color: ${palette('primary', 0)};

  i {
    color: #fff;
    font-size: 50px;
    padding: 25px;
  }
`;
