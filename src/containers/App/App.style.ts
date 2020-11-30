import { Layout } from 'antd';
import styled from 'styled-components';
import { palette, size } from 'styled-theme';

import { media } from 'helpers/styleHelper';

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

export const BackLink = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  margin-bottom: 10px !important;
  ${media.sm`
    margin-bottom: 20px !important;
  `}
  cursor: pointer;

  svg {
    margin-right: 6px;
    font-size: 22px;
    font-weight: bold;
    color: ${palette('primary', 0)};
  }

  span {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${palette('primary', 0)};
  }
`;
