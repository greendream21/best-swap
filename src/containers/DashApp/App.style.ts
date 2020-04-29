import styled from 'styled-components';
import { palette, size } from 'styled-theme';
import { Layout } from 'antd';
import { media } from '../../helpers/styleHelper';

const { Content } = Layout;

export const ContentWrapper = styled(Content)`
  background: ${palette('background', 3)};
  min-height: calc(100vh - 120px);
  margin-top: ${size('headerHeight', '90px')};
  padding: 10px; /* TODO: add sizes to theme once final */
  ${media.sm`
    padding: 20px;/* TODO: add sizes to theme once final */
  `}
  ${media.md`
    padding: 30px;/* TODO: add sizes to theme once final */
  `}
`;
