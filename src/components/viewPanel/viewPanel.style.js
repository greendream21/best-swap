import styled from 'styled-components';
import { size } from 'styled-theme';

export const ViewPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${size('panelHeight', '500px')};
`;
