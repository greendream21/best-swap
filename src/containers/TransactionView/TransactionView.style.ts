import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Pagination } from 'antd';
import ContentView from '../../components/utility/contentView';
import { transition } from '../../settings/style-util';

export const ContentWrapper = styled(ContentView)`
  padding: 20px;
`;

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  li.ant-pagination-item.ant-pagination-item-active {
    border-color: ${palette('primary', 1)};
    a {
      color: ${palette('primary', 1)};
    }
  }

  li.ant-pagination-item {
    &:hover {
      border-color: ${palette('primary', 1)};
      a {
        color: ${palette('primary', 1)};
        ${transition()};
      }
      ${transition()};
    }
  }
`;
