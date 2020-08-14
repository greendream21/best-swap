import { Grid } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Label from '../../uielements/label';

const getWidth = () => {
  const isDesktopView = Grid.useBreakpoint()?.lg ?? false;
  return isDesktopView ? '100%' : '150px';
};

export const StyledText = styled(Label)`
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: ${() => getWidth()};
  color: ${palette('text', 1)};
  white-space: nowrap;
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
`;

export const StyledLinkText = styled(Label)`
  margin-right: 10px;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 200px;
  white-space: nowrap;
`;
