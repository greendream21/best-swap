import styled from 'styled-components';
import { key, palette } from 'styled-theme';
import { Table } from 'antd';

export const TableWrapper = styled(Table)`
  .ant-table-thead > tr > th {
    padding-bottom: 4px;
    border-top: none;
    font-size: ${key('sizes.font.tiny', '8px')};
    font-weight: bold;
    color: ${palette('text', 0)};
    background-color: #fff;
  }

  .ant-table-tbody > tr > td {
    padding-top: 6px;
    padding-bottom: 6px;

    .action {
      display: flex;
      float: right;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
`;
