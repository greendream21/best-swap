import { fill as _fill } from 'lodash';

export const stats = {
  nodes: [
    {
      title: 'Total',
      value: '7',
    },
    {
      title: 'Monthly',
      value: '546',
    },
    {
      title: 'Total Unique',
      value: '1234',
    },
  ],
  threshold: [
    {
      title: 'Total',
      value: '64',
    },
  ],
  sidechain: [
    {
      title: 'Block Height',
      value: '1234',
    },
    {
      title: 'TPS',
      value: '2',
    },
    {
      title: 'Size',
      value: '12gb',
    },
    {
      title: 'Time',
      value: '14:01:04 GMT',
    },
  ],
};

const tableRowData = {
  height: '2453',
  transactions: '2',
  hash: '1Pbw5XYk3CFZ9n5tSyhCdZVv4z4wBEiUV2',
};

export const tableData = _fill(Array(6), tableRowData);

export const columns = [
  {
    title: 'Height',
    dataIndex: 'height',
    key: 'height',
  },
  {
    title: 'Transactions',
    dataIndex: 'transactions',
    key: 'transactions',
  },
  {
    title: 'Hash',
    dataIndex: 'hash',
    key: 'hash',
  },
];
