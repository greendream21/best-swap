import styled from 'styled-components';
import { palette, key } from 'styled-theme';

export const StyledTab = component => styled(component)`
  .ant-tabs-nav {
    font-size: ${key('sizes.font.label', '14px')};
    text-transform: uppercase;
  }
`;
