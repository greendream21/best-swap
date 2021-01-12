import { Pagination } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import UnstyledInput from 'components/uielements/input';
import ContentView from 'components/utility/contentView';

import { media } from 'helpers/styleHelper';

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
      }

      .tx-history-detail {
        display: flex;
        align-items: center;
        p {
          margin-right: 8px;
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

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;

  .dropdown-wrapper button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  form {
    flex: 1;
  }
`;

export const Input = styled(UnstyledInput)`
  &.ant-input {
    width: 100%;
    height: 30px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

export const TxToolsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 8px;

  button {
    margin-right: 8px;
  }
`;
