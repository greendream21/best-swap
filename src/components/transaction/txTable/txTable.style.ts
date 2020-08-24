import styled from 'styled-components';
import { palette } from 'styled-theme';

import Label from '../../uielements/label';

export const StyledText = styled(Label)`
  font-size: 14px;
  color: ${palette('text', 1)};
  white-space: nowrap;
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledLinkText = styled(Label)`
  margin-right: 10px;
  font-size: 14px;
`;
