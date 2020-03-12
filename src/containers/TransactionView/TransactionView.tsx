import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';

import Table from '../../components/uielements/table';
import FilterDropdown from '../../components/filterDropdown';
import TxLabel from '../../components/transaction/txLabel';
import TxInfo from '../../components/transaction/txInfo';
import TransactionLoader from '../../components/utility/loaders/transaction';
import { DetailIcon } from '../../components/icons/txIcons';

import {
  ContentWrapper,
  StyledPagination,
  MobileColumeHeader,
} from './TransactionView.style';
import { TxDetails } from '../../types/generated/midgard';
import { ViewType, Maybe } from '../../types/bepswap';

import * as midgardActions from '../../redux/midgard/actions';
import { TxDetailData } from '../../redux/midgard/types';
import { User } from '../../redux/wallet/types';
import { RootState } from '../../redux/store';

type ComponentProps = {};

type ConnectedProps = {
  user: Maybe<User>;
  txData: TxDetailData;
  getTxByAddress: typeof midgardActions.getTxByAddress;
};

type Props = ComponentProps & ConnectedProps;

const Transaction: React.FC<Props> = (props): JSX.Element => {
  const { user, txData, getTxByAddress } = props;

  useEffect(() => {
    const walletAddress = user?.wallet ?? null;
    if (walletAddress) {
      getTxByAddress(walletAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTxTable = (data: TxDetailData, view: ViewType) => {
      return RD.fold(
        () => null, // initial
        () => <TransactionLoader />,
        (error: Error) => <p>{error.toString()}</p>, // show error
        (data: TxDetails[]): JSX.Element => {
          const filterCol = {
            key: 'filter',
            title: <FilterDropdown />,
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
              render: (text: string, rowData: TxDetails) => {
                return <TxInfo data={rowData} />;
              },
            },
            {
              key: 'time',
              title: 'time',
              render: (text: string, rowData: TxDetails) => {
                const { date } = rowData;

                return new Date(date || 0).toDateString();
              },
            },
            {
              key: 'detail',
              title: 'detail',
              render: () => {
                return (
                  <div className="tx-detail-button">
                    <DetailIcon />
                  </div>
                );
              },
            },
          ];

          const mobileColumns = [
            {
              key: 'history',
              title: (
                <MobileColumeHeader>
                  <div className="mobile-col-title">history</div>
                  <div className="mobile-col-filter">
                    <FilterDropdown />
                  </div>
                </MobileColumeHeader>
              ),
              render: (text: string, rowData: TxDetails) => {
                const { type, date } = rowData;
                const dateString = new Date(date || 0).toDateString();

                return (
                  <div className="tx-history-row">
                    <div className="tx-history-data">
                      <TxLabel type={type} />
                      <div className="tx-history-detail">
                        <p>{dateString}</p>
                        <div className="tx-detail-button">
                          <DetailIcon />
                        </div>
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

          const columns =
            view === ViewType.DESKTOP ? desktopColumns : mobileColumns;

          return <Table columns={columns} dataSource={data} rowKey="key" />;
        },
      )(data);
  };

  return (
    <>
      <ContentWrapper className="transaction-view-wrapper desktop-view">
        {renderTxTable(txData, ViewType.DESKTOP)}
      </ContentWrapper>
      <ContentWrapper className="transaction-view-wrapper mobile-view">
        {renderTxTable(txData, ViewType.MOBILE)}
      </ContentWrapper>
      <StyledPagination defaultCurrent={1} total={50} />
    </>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      user: state.Wallet.user,
      txData: state.Midgard.txData,
    }),
    {
      getTxByAddress: midgardActions.getTxByAddress,
    },
  ),
)(Transaction) as React.FC<ComponentProps>;
