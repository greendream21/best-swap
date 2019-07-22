import styled from 'styled-components';
import { palette, size } from 'styled-theme';
import { Layout } from 'antd';

const { Content } = Layout;

export const ContentWrapper = styled(Content)`
  background: ${palette('background', 2)};
  height: calc(
    100vh - ${size('headerHeight', '90px')} - ${size('footerHeight', '90px')}
  );
  margin-top: ${size('headerHeight', '90px')};
  padding: 50px 50px;
`;
