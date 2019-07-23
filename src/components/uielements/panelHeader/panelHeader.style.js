import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${size('panelHeaderHeight', '10px')};
  padding: 0 ${key('sizes.gutter.horizontal', '30px')};
  margin-top: 3px;
  border-bottom: 3px solid ${palette('primary', 5)};
`;
