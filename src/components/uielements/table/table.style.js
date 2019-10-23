import styled from 'styled-components';
import { key, palette } from 'styled-theme';
import { Table } from 'antd';

export const TableWrapper = styled(Table)`
  .ant-table-thead > tr > th {
    height: 70px;
    border-top: none;
    font-size: ${key('sizes.font.normal', '12px')};
    color: ${palette('text', 5)};
    background-color: #fff;
    text-transform: uppercase;
  }

  .ant-table-tbody > tr > td {
    height: 96px;
    text-transform: uppercase;
  }

  .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-thead
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td,
  .ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
    > td {
    background: ${palette('success', 2)};
  }
`;
