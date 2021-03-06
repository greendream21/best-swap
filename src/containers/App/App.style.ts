import { Layout } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { media } from 'helpers/styleHelper';

const { Content } = Layout;

export const ContentWrapper = styled(Content)`
  min-height: calc(100vh - 146px);

  padding: 10px 10px 0px 10px;
  ${media.sm`
    padding: 10px 20px 0px 20px;
  `}
  ${media.md`
    padding: 10px 30px 0px 30px;
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
