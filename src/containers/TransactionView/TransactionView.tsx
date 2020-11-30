import React, { useState, useEffect, useMemo } from 'react';

import { FormattedDate, FormattedTime } from 'react-intl';
import { connect } from 'react-redux';

import * as RD from '@devexperts/remote-data-ts';
import { Grid } from 'antd';
import { compose } from 'redux';


import FilterDropdown from 'components/filterDropdown';
import TxInfo from 'components/transaction/txInfo';
import TxLabel from 'components/transaction/txLabel';
import AddWallet from 'components/uielements/addWallet';
import Label from 'components/uielements/label';
import Table from 'components/uielements/table';

import * as midgardActions from 'redux/midgard/actions';
import { TxDetailData } from 'redux/midgard/types';
import { RootState } from 'redux/store';
import { User } from 'redux/wallet/types';

import usePrevious from 'hooks/usePrevious';

import { Maybe } from 'types/bepswap';
import {
  TxDetails,
  InlineResponse2001,
  TxDetailsTypeEnum,
} from 'types/generated/midgard';

import {
  ContentWrapper,
  StyledPagination,
  MobileColumeHeader,
} from './TransactionView.style';

type ComponentProps = Record<string, never>;

type ConnectedProps = {
  user: Maybe<User>;
  txData: TxDetailData;
  txCurData: Maybe<InlineResponse2001>;
  refreshTxStatus: boolean;
  getTxByAddress: typeof midgardActions.getTxByAddress;
};

type Props = ComponentProps & ConnectedProps;

const Transaction: React.FC<Props> = (props): JSX.Element => {
  const { user, txData, txCurData, refreshTxStatus, getTxByAddress } = props;
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const isDesktopView = Grid.useBreakpoint().lg;

  const limit = 10;

  const allTxTypeParams = `${TxDetailsTypeEnum.Swap},${TxDetailsTypeEnum.DoubleSwap},${TxDetailsTypeEnum.Stake},${TxDetailsTypeEnum.Unstake}`;

  const txTypesPair: { [key: string]: string } = {
    all: allTxTypeParams,
    swap: TxDetailsTypeEnum.Swap,
    doubleSwap: TxDetailsTypeEnum.DoubleSwap,
    stake: TxDetailsTypeEnum.Stake,
    unstake: TxDetailsTypeEnum.Unstake,
  };

  const getTxDetails = () => {
    const address = user?.wallet ?? null;

    if (address) {
      getTxByAddress({
        address,
        offset: (page - 1) * limit,
        limit,
        type: txTypesPair[filter],
      });
    }
  };

  const handleSelectFilter = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  useEffect(() => {
    getTxDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  // reset filter, page after refresh
  const prevRefreshTxStatus = usePrevious(refreshTxStatus);
  useEffect(() => {
    if (!refreshTxStatus && prevRefreshTxStatus) {
      setPage(1);
      setFilter('all');
    }
  }, [refreshTxStatus, prevRefreshTxStatus]);

  const filterCol = useMemo(
    () => ({
      key: 'filter',
      width: 200,
      align: 'center',
      title: <FilterDropdown value={filter} onClick={handleSelectFilter} />,
      render: (text: string, rowData: TxDetails) => {
        const { type } = rowData;

        return <TxLabel type={type} />;
      },
    }),
    [filter],
  );

  const desktopColumns = useMemo(
    () => [
      filterCol,
      {
        key: 'history',
        title: 'history',
        align: 'center',
        render: (text: string, rowData: TxDetails) => {
          return <TxInfo data={rowData} />;
        },
      },
      {
        key: 'date',
        title: 'date',
        align: 'center',
        width: 200,
        render: (text: string, rowData: TxDetails) => {
          const { date: timestamp = 0 } = rowData;
          const date = new Date(timestamp * 1000);
          return (
            <>
              <FormattedDate
                value={date}
                year="numeric"
                month="long"
                day="2-digit"
              />{' '}
              <FormattedTime
                value={date}
                hour="numeric"
                minute="numeric"
                second="numeric"
              />
            </>
          );
        },
      },
    ],
    [filterCol],
  );

  const mobileColumns = useMemo(
    () => [
      {
        key: 'history',
        align: 'center',
        title: (
          <MobileColumeHeader>
            <div className="mobile-col-title">history</div>
            <div className="mobile-col-filter">
              <FilterDropdown value={filter} onClick={handleSelectFilter} />
            </div>
          </MobileColumeHeader>
        ),
        render: (_: string, rowData: TxDetails) => {
          const { type, date: timestamp = 0, in: _in } = rowData;
          const date = new Date(timestamp * 1000);

          return (
            <div className="tx-history-row">
              <div className="tx-history-data">
                <TxLabel type={type} />
                <div className="tx-history-detail">
                  <p>
                    <FormattedDate
                      value={date}
                      year="numeric"
                      month="2-digit"
                      day="2-digit"
                    />{' '}
                    <FormattedTime
                      value={date}
                      hour="2-digit"
                      minute="2-digit"
                      second="2-digit"
                      hour12={false}
                    />
                  </p>
                </div>
              </div>
              <div className="tx-history-info">
                <TxInfo data={rowData} />
              </div>
            </div>
          );
        },
      },
    ],
    [filter],
  );

  const renderTxTable = (data: TxDetails[], loading: boolean) => {
    const columns = isDesktopView ? desktopColumns : mobileColumns;

    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record: TxDetails, index: number) => index}
        size="small"
        loading={loading}
      />
    );
  };

  const pageContent = (data: TxDetails[], count: number, loading: boolean) => {
    return (
      <ContentWrapper>
        <ContentWrapper className="transaction-view-wrapper">
          {renderTxTable(data, loading)}
        </ContentWrapper>
        {count ? (
          <StyledPagination
            current={page}
            onChange={setPage}
            pageSize={limit}
            total={count}
          />
        ) : (
          ''
        )}
      </ContentWrapper>
    );
  };

  const renderPage = () => {
    const walletAddress = user?.wallet ?? null;

    if (walletAddress) {
      return RD.fold(
        () => <div />, // initial
        () => {
          const count = txCurData?.count ?? 0;
          const txs = txCurData?.txs ?? [];

          return pageContent(txs, count, true);
        },
        (error: Error) => (
          <ContentWrapper className="transaction-view-wrapper center-align">
            <Label size="big">
              Loading of transaction history data failed.
            </Label>
            {!!error?.message && <Label size="small">{error.message}</Label>}
          </ContentWrapper>
        ),
        (data: InlineResponse2001): JSX.Element => {
          const { count = 0, txs = [] } = data;
          return pageContent(txs, count, false);
        },
      )(txData);
    } else {
      return (
        <ContentWrapper className="transaction-view-wrapper center-align">
          <AddWallet />
        </ContentWrapper>
      );
    }
  };

  return renderPage();
};

export default compose(
  connect(
    (state: RootState) => ({
      user: state.Wallet.user,
      txData: state.Midgard.txData,
      txCurData: state.Midgard.txCurData,
      refreshTxStatus: state.App.refreshTxStatus,
    }),
    {
      getTxByAddress: midgardActions.getTxByAddress,
    },
  ),
)(Transaction) as React.FC<ComponentProps>;
