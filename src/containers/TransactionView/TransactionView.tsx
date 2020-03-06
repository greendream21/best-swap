import React from 'react';

import Table from '../../components/uielements/table';
import FilterDropdown from '../../components/filterDropdown';
import TxLabel from '../../components/transaction/txLabel';
import TxInfo from '../../components/transaction/txInfo';
import {
  ContentWrapper,
  StyledPagination,
  MobileColumeHeader,
} from './TransactionView.style';
import { TxDetails } from '../../types/generated/midgard';
import { ViewType } from '../../types/bepswap';

import { txData } from './data';
import { DetailIcon } from '../../components/icons/txIcons';

const Transaction: React.FC = (): JSX.Element => {
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

    const columns = view === ViewType.DESKTOP ? desktopColumns : mobileColumns;

    return <Table columns={columns} dataSource={data} rowKey="key" />;
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

export default Transaction;
