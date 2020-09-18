import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Pagination } from 'antd';
import ContentView from '../../components/utility/contentView';
import { media } from '../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  padding: 10px;
  ${media.sm`
    padding: 20px;
  `}

  &.mobile-view {
    display: block;
    ${media.sm`
      display: none;
    `}

    .tx-history-row {
      display: flex;
      flex-direction: column;

      .tx-history-data {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        margin-bottom: 8px;

        .tx-history-detail {
          display: flex;
          align-items: center;
          p {
            margin-right: 8px;
          }
        }
      }
    }
  }

  .tx-detail-button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  &.center-align {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const MobileColumeHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 100%;
  .mobile-col-title {
    text-align: center;
  }

  .mobile-col-filter {
    margin-left: 8px;
  }
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
