import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { FormattedDate, FormattedTime } from 'react-intl';

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
import { TESTNET_TX_BASE_URL } from '../../helpers/apiHelper';

import * as midgardActions from '../../redux/midgard/actions';
import { TxDetailData } from '../../redux/midgard/types';
import { User } from '../../redux/wallet/types';
import { RootState } from '../../redux/store';
import AddWallet from '../../components/uielements/addWallet';

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

  const renderTxTable = (data: TxDetails[], view: ViewType) => {
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
        key: 'date',
        title: 'date',
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
      {
        key: 'detail',
        title: 'detail',
        render: (text: string, rowData: TxDetails) => {
          const { in: _in } = rowData;
          const txID = _in?.txID ?? null;
          const txURL = txID ? TESTNET_TX_BASE_URL + txID : null;

          return (
            <div className="tx-detail-button">
              {txURL ? (
                <a href={txURL} target="_blank" rel="noopener noreferrer">
                  <DetailIcon />
                </a>
              ) : (
                <DetailIcon />
              )}
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
          const { type, date: timestamp = 0, in: _in } = rowData;
          const date = new Date(timestamp * 1000);
          const txID = _in?.txID ?? null;
          const txURL = txID ? TESTNET_TX_BASE_URL + txID : null;

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
                  <div className="tx-detail-button">
                    {txURL ? (
                      <a href={txURL} target="_blank" rel="noopener noreferrer">
                        <DetailIcon />
                      </a>
                    ) : (
                      <DetailIcon />
                    )}
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

    const columns = view === ViewType.DESKTOP ? desktopColumns : mobileColumns;

    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record: TxDetails, index: number) => index}
      />
    );
  };

  const pageContent = (data: TxDetails[]) => (
    <>
      <ContentWrapper className="transaction-view-wrapper desktop-view">
        {renderTxTable(data, ViewType.DESKTOP)}
      </ContentWrapper>
      <ContentWrapper className="transaction-view-wrapper mobile-view">
        {renderTxTable(data, ViewType.MOBILE)}
      </ContentWrapper>
      <StyledPagination defaultCurrent={1} total={data?.length ?? 0} />
    </>
  );

  const renderPage = () => {
    const walletAddress = user?.wallet ?? null;

    if (walletAddress) {
      return RD.fold(
        () => <div />, // initial
        () => <TransactionLoader />,
        (error: Error) => <p>{error.toString()}</p>, // show error
        (data: TxDetails[]): JSX.Element => pageContent(data),
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
    }),
    {
      getTxByAddress: midgardActions.getTxByAddress,
    },
  ),
)(Transaction) as React.FC<ComponentProps>;
