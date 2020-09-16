import { Pagination } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import ContentView from '../../components/utility/contentView';
import { media } from '../../helpers/styleHelper';
import Table from '../../components/uielements/table';

export const ContentWrapper = styled(ContentView)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${palette('background', 3)};
  padding: 0;

  .content-loader {
    rect {
      width: 100%;
      ${media.sm`
        display: 80%;
      `}
    }
  }

  .pool-list-view {
    display: none;
    ${media.sm`
      display: block;
    `}

    &.mobile-view {
      display: block;
      ${media.sm`
        display: none;
      `}
    }

    padding-top: 20px;
    .pool-card {
      margin-bottom: 10px;
    }
  }
`;

export const StyledTable = styled(Table)`
  tr:hover {
    cursor: pointer;
  }
`;

export const PoolViewTools = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 25px;

  .add-new-pool {
    display: flex;
    align-items: center;
    cursor: pointer;
    max-width: 160px;

    .label-wrapper {
      padding-left: 20px;
    }
  }
`;

export const ActionHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ActionColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .action-column-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 250px;
  }
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
