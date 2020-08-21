import styled from 'styled-components';
import { palette } from 'styled-theme';
import Pagination from 'antd/lib/pagination';
import ContentView from '../../components/utility/contentView';
import { media } from '../../helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  .pool-caption-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;

    display: none;
    ${media.sm`
      display: flex;
    `}

    &.mobile-view {
      display: flex;
      flex-direction: column;
      ${media.sm`
        display: none;
      `}
    }
  }

  .detail-info-view {
    display: none;
    ${media.lg`
      display: flex;
    `}

    &.mobile-view {
      display: flex;
      ${media.lg`
        display: none;
      `}
    }
  }
`;

export const PoolCaptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PoolCaptionTitle = styled.span`
  font-family: 'Exo 2';
  font-weight: bold;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${palette('text', 0)};
  margin-right: 20px;
`;

export const PoolCaptionPrice = styled.span`
  font-family: 'Exo 2';
  font-weight: normal;
  font-size: 32px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${palette('text', 0)};
`;

export const PoolCaptionButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 250px;
`;

export const TransactionWrapper = styled.div`
  width: 100%;
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

export const ChartContainer = styled.div`
  margin-left: 16px;
`;
