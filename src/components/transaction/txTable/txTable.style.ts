import { Pagination } from 'antd';
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

export const TransactionWrapper = styled.div`
  padding: 20px 0px;
`;

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  li {
    a.ant-pagination-item-link {
      transition: none;
    }
  }

  li.ant-pagination-item.ant-pagination-item-active {
    border-color: ${palette('primary', 0)};
    a {
      color: ${palette('primary', 0)};
    }
  }

  li.ant-pagination-item {
    background: ${palette('background', 1)};
    border-color: ${palette('gray', 0)};
    a {
      color: ${palette('text', 0)};
    }

    &:hover {
      border-color: ${palette('primary', 0)};
      a {
        color: ${palette('primary', 0)};
      }
    }
  }

  li.ant-pagination-prev,
  li.ant-pagination-next {
    a {
      background: ${palette('background', 1)};
      border-color: ${palette('gray', 0)};
      color: ${palette('text', 0)};
      &:hover {
        border-color: ${palette('primary', 0)};
        color: ${palette('primary', 0)};
      }
    }
  }

  .anticon.ant-pagination-item-link-icon {
    color: ${palette('primary', 0)};
  }

  .ant-select-dropdown {
    background: ${palette('background', 1)};
    color: ${palette('text', 0)};
    .ant-select-item {
      color: ${palette('text', 0)};
      &.ant-select-item-option-active {
        background: ${palette('background', 2)};
        color: ${palette('primary', 0)};
      }
    }
  }

  .ant-select.ant-pagination-options-size-changer {
    .ant-select-selector {
      background: ${palette('background', 1)};
      border-color: ${palette('gray', 0)};
      color: ${palette('text', 0)};
      transition: none;
    }
    svg {
      path {
        fill: ${palette('text', 0)};
      }
    }

    &:hover {
      .ant-select-selector {
        border-color: ${palette('primary', 0)};
        color: ${palette('primary', 0)};
      }
      svg {
        path {
          fill: ${palette('primary', 0)};
        }
      }
    }
  }
`;
