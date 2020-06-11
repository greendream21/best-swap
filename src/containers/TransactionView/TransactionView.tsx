import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { FormattedDate, FormattedTime } from 'react-intl';

import Table from '../../components/uielements/table';
import FilterDropdown from '../../components/filterDropdown';
import TxLabel from '../../components/transaction/txLabel';
import TxInfo from '../../components/transaction/txInfo';

import {
  ContentWrapper,
  StyledPagination,
  MobileColumeHeader,
} from './TransactionView.style';
import {
  TxDetails,
  InlineResponse2001,
  TxDetailsTypeEnum,
} from '../../types/generated/midgard';
import { ViewType, Maybe } from '../../types/bepswap';

import * as midgardActions from '../../redux/midgard/actions';
import { TxDetailData } from '../../redux/midgard/types';
import { User } from '../../redux/wallet/types';
import { RootState } from '../../redux/store';
import AddWallet from '../../components/uielements/addWallet';

type ComponentProps = {};

type ConnectedProps = {
  user: Maybe<User>;
  txData: TxDetailData;
  txCurData: Maybe<InlineResponse2001>;
  getTxByAddress: typeof midgardActions.getTxByAddress;
};

type Props = ComponentProps & ConnectedProps;

const Transaction: React.FC<Props> = (props): JSX.Element => {
  const { user, txData, txCurData, getTxByAddress } = props;
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const limit = 5;

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

  const renderTxTable = (
    data: TxDetails[],
    view: ViewType,
    loading: boolean,
  ) => {
    const filterCol = {
      key: 'filter',
      width: 200,
      align: 'center',
      title: <FilterDropdown value={filter} onClick={handleSelectFilter} />,
      render: (text: string, rowData: TxDetails) => {
        const { type } = rowData;

        return <TxLabel type={type} />;
      },
    };

    const desktopColumns = [
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
    ];

    const mobileColumns = [
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
    ];

    const columns = view === ViewType.DESKTOP ? desktopColumns : mobileColumns;

    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record: TxDetails, index: number) => index}
        loading={loading}
      />
    );
  };

  const pageContent = (data: TxDetails[], count: number, loading: boolean) => {
    return (
      <ContentWrapper>
        <ContentWrapper className="transaction-view-wrapper desktop-view">
          {renderTxTable(data, ViewType.DESKTOP, loading)}
        </ContentWrapper>
        <ContentWrapper className="transaction-view-wrapper mobile-view">
          {renderTxTable(data, ViewType.MOBILE, loading)}
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
            <h2>Loading of transaction history data failed.</h2>
            {(error?.message ?? false) && <p>{error.message}</p>}
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
    }),
    {
      getTxByAddress: midgardActions.getTxByAddress,
    },
  ),
)(Transaction) as React.FC<ComponentProps>;
