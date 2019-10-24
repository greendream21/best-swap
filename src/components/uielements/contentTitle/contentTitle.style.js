import styled from 'styled-components';
import { palette, key } from 'styled-theme';

export const ContentTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 52px;

  background: ${palette('primary', 0)};
  color: #fff;
  font-size: ${key('sizes.font.big', '15px')};
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;

  border-radius: 1px;
`;
