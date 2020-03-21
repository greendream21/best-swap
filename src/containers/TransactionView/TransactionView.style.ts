import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Pagination } from 'antd';
import ContentView from '../../components/utility/contentView';
import { transition } from '../../settings/style-util';
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
  }
`;

export const MobileColumeHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .mobile-col-title {
    text-align: center;
  }

  .mobile-col-filter {
    display: block;
    position: absolute;
    top: 5px;
    left: 150px;
  }
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
