import styled from 'styled-components';
import { palette } from 'styled-theme';

export const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${palette('background', 0)};
`;
