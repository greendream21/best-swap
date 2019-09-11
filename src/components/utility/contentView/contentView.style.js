import styled from 'styled-components';
import { key } from 'styled-theme';

export const ContentViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;

  padding: ${key('sizes.gutter.vertical', '20px')}
    ${key('sizes.gutter.horizontal', '30px')};
`;
