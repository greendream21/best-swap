/* eslint-disable no-underscore-dangle */
import React, { useCallback, useMemo } from 'react';
import { Grid, Tag } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { formatBaseAsTokenAmount, baseAmount } from '@thorchain/asgardex-token';
import { ColumnType } from 'antd/lib/table';
import moment from 'moment';

import { TxDetailData } from '../../../redux/midgard/types';
import { getAssetFromString } from '../../../redux/midgard/utils';
import {
  TxDetails,
  TxDetailsTypeEnum,
  Coin,
} from '../../../types/generated/midgard';
import { BINANCE_TX_BASE_URL } from '../../../helpers/apiHelper';
import Table from '../../uielements/table';
import { StyledText, StyledLink, StyledLinkText } from './txTable.style';
import { FixmeType } from '../../../types/bepswap';

type Props = {
  txData: TxDetailData;
};

type Column = 'address' | 'date' | 'type' | 'in' | 'out';

const tags: Record<TxDetailsTypeEnum, string> = {
  swap: '#2db7f5',
  stake: '#87d068',
  unstake: '#f50',
  doubleSwap: '#2db7f5',
  add: '#87d068',
  refund: '#f50',
  rewards: '#2db7f5',
  pool: '#87d068',
  gas: '#f50',
};

const TxTable: React.FC<Props> = React.memo(
  (props: Props): JSX.Element => {
    const { txData } = props;
    const isDesktopView = Grid.useBreakpoint()?.lg ?? false;
    const loading = txData._tag !== 'RemoteSuccess';

    const truncateAddress = useCallback((address: string) => {
      if (address && address.length > 9) {
        const first = address.substr(0, 6);
        const last = address.substr(address.length - 3, 3);
        return `${first}...${last}`;
      }
      return address;
    }, []);

    const getColumnRenderer = useCallback((): Record<
      Column,
      (value: FixmeType, row: TxDetails) => JSX.Element
    > => {
      return {
        address: (_, row) => {
          return (
            <StyledText>{truncateAddress(row?.in?.address ?? '')}</StyledText>
          );
        },
        type: (_, row) => {
          return (
            <Tag color={tags[row?.type ?? TxDetailsTypeEnum.Swap]}>
              {row.type}
            </Tag>
          );
        },
        in: (_, row) => {
          if (row?.type === TxDetailsTypeEnum.Unstake) {
            return <StyledLinkText>N/A</StyledLinkText>;
          }

          const txId = row?.in?.txID;
          const coins = row?.in?.coins ?? [];
          let inData = '';
          coins.forEach((txDetail: Coin, index: number) => {
            const { asset, amount } = txDetail;
            const { ticker: assetValue } = getAssetFromString(asset);
            const amountValue = formatBaseAsTokenAmount(baseAmount(amount));
            inData += `${assetValue}: ${amountValue}`;
            if (index < coins.length - 1) inData += ' | ';
          });

          return (
            <StyledLink
              href={`${txId ? `${BINANCE_TX_BASE_URL}${txId}` : '#'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledLinkText>{inData}</StyledLinkText>
              <LinkOutlined />
            </StyledLink>
          );
        },
        out: (_, row) => {
          if (
            row?.type === TxDetailsTypeEnum.Stake ||
            row?.type === TxDetailsTypeEnum.Add
          ) {
            return <StyledLinkText>N/A</StyledLinkText>;
          }

          const txId = row?.out?.[0]?.txID ?? '';
          const coins = row?.out?.[0]?.coins ?? [];
          if (row?.type === TxDetailsTypeEnum.Unstake) {
            coins.concat(row?.out?.[1]?.coins ?? []);
          }
          let outData = '';
          coins.forEach((txDetail: Coin, index: number) => {
            const { asset, amount } = txDetail;
            const { ticker: assetValue } = getAssetFromString(asset);
            const amountValue = formatBaseAsTokenAmount(baseAmount(amount));
            outData += `${assetValue}: ${amountValue}`;
            if (index < coins.length - 1) outData += ' | ';
          });

          return (
            <StyledLink
              href={`${txId ? `${BINANCE_TX_BASE_URL}${txId}` : '#'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <StyledLinkText>{outData}</StyledLinkText>
              <LinkOutlined />
            </StyledLink>
          );
        },
        date: (_, row) => {
          return <span>{moment((row?.date ?? 0) * 1000).fromNow()}</span>;
        },
      };
    }, [truncateAddress]);

    const columnRenders = useMemo(() => getColumnRenderer(), [
      getColumnRenderer,
    ]);

    const addressColumn: ColumnType<TxDetails> = useMemo(
      () => ({
        key: 'address',
        title: 'Address',
        dataIndex: 'address',
        align: 'left',
        render: columnRenders.address,
      }),
      [columnRenders.address],
    );

    const dateColumn: ColumnType<TxDetails> = useMemo(
      () => ({
        key: 'date',
        title: 'Time',
        dataIndex: 'date',
        align: 'right',
        render: columnRenders.date,
      }),
      [columnRenders.date],
    );

    const typeColumn: ColumnType<TxDetails> = useMemo(
      () => ({
        key: 'type',
        title: 'type',
        dataIndex: 'type',
        align: 'center',
        render: columnRenders.type,
      }),
      [columnRenders.type],
    );

    const inColumn: ColumnType<TxDetails> = useMemo(
      () => ({
        key: 'in',
        title: 'In',
        dataIndex: 'in',
        align: 'left',
        render: columnRenders.in,
      }),
      [columnRenders.in],
    );

    const outColumn: ColumnType<TxDetails> = useMemo(
      () => ({
        key: 'out',
        title: 'Out',
        dataIndex: 'out',
        align: 'left',
        render: columnRenders.out,
      }),
      [columnRenders.out],
    );

    const desktopColumns = useMemo(
      () => [addressColumn, typeColumn, inColumn, outColumn, dateColumn],
      [addressColumn, typeColumn, inColumn, outColumn, dateColumn],
    );

    const mobileColumns = useMemo(
      () => [addressColumn, typeColumn, dateColumn],
      [addressColumn, typeColumn, dateColumn],
    );

    return (
      <Table
        loading={loading}
        columns={isDesktopView ? desktopColumns : mobileColumns}
        dataSource={txData._tag === 'RemoteSuccess' ? txData.value.txs : []}
      />
    );
  },
);

export default TxTable;
