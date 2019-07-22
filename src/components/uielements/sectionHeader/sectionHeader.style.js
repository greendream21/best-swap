import styled from 'styled-components';
import { palette, size, key } from 'styled-theme';

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${size('contentHeaderHeight', '10px')};
`;
