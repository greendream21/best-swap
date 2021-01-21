import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { FormattedDate, FormattedTime } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import * as RD from '@devexperts/remote-data-ts';
import { Grid, Form } from 'antd';

import FilterDropdown from 'components/filterDropdown';
import Helmet from 'components/helmet';
import TxInfo from 'components/transaction/txInfo';
import TxLabel from 'components/transaction/txLabel';
import AddWallet from 'components/uielements/addWallet';
import Button from 'components/uielements/button';
import Table from 'components/uielements/table';

import { getTx } from 'redux/midgard/actions';
import { RootState } from 'redux/store';

import usePrevious from 'hooks/usePrevious';
import useQuery from 'hooks/useQuery';

import { isAddress } from 'helpers/binanceHelper';
import { getTxViewURL } from 'helpers/routerHelper';

import { TX_PAGE_LIMIT } from 'settings/constants';

import { TxDetails, InlineResponse2001 } from 'types/generated/midgard';

import {
  ContentWrapper,
  FilterContainer,
  StyledPagination,
  Input,
  TxToolsContainer,
} from './TransactionView.style';
import { TxFilter } from './types';

const Transaction: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const txData = useSelector((state: RootState) => state.Midgard.txData);
  const user = useSelector((state: RootState) => state.Wallet.user);
  const walletAddress = user?.wallet ?? null;
  const txRefreshing = useSelector(
    (state: RootState) => state.Midgard.txRefreshing,
  );

  const history = useHistory();
  const query = useQuery();
  const type = (query?.type ?? 'all') as string;
  const offset = Number(query?.offset ?? 0);
  const address = query?.address as string;
  const txId = query?.txId as string;
  const asset = query?.asset as string;

  const isValidFilter = useCallback(
    (filter: TxFilter) => {
      const { type, offset = 0, address, txId, asset } = filter;
      if (
        type === '' ||
        Number.isNaN(offset) ||
        address === '' ||
        txId === '' ||
        asset === ''
      ) {
        return false;
      }
      return true;
    },
    [],
  );

  const initialFilter: TxFilter = useMemo(
    () => ({
      limit: TX_PAGE_LIMIT,
      type: type || 'all',
      offset,
      address,
      txId,
      asset,
    }),
    [offset, type, address, txId, asset],
  );

  const [filter, setFilter] = useState<TxFilter>(initialFilter);
  const [page, setPage] = useState<number>(Number(offset) + 1);

  const [filterInput, setFilterInput] = useState(address || txId || '');

  const isDesktopView = Grid.useBreakpoint().lg;
  console.log('filterInput', filterInput);
  useEffect(() => {
    const { address, txId, type, offset = 0 } = initialFilter;

    if (isValidFilter(initialFilter)) {
      dispatch(
        getTx({
          ...initialFilter,
          type: type === 'all' ? undefined : type,
          offset,
          limit: TX_PAGE_LIMIT,
        }),
      );
    } else {
      history.push('/tx');
    }

    setFilterInput(address || txId || '');
    setPage(offset + 1);
    setFilter({
      ...initialFilter,
      type: type || 'all',
    });
  }, [dispatch, initialFilter, isValidFilter, history]);

  useEffect(() => {
    history.push(getTxViewURL(filter));
  }, [history, filter]);

  const handleResetFilters = useCallback(() => {
    history.push('/tx');
  }, [history]);

  const handleSearchMyAddress = useCallback(() => {
    if (walletAddress) {
      const newFilter = {
        address: walletAddress,
      };
      history.push(getTxViewURL(newFilter));
    }
  }, [history, walletAddress]);

  const handleSelectFilter = useCallback(
    (value: string) => {
      const newFilter = {
        ...filter,
        type: value === 'all' ? undefined : value,
      };
      setFilter(newFilter);
    },
    [filter],
  );

  const handleChangePage = useCallback(
    (value: number) => {
      setPage(value);
      const newFilter = {
        ...filter,
        offset: value - 1,
      };
      setFilter(newFilter);
    },
    [filter],
  );

  // reset filter, page after refresh
  const prevRefreshTxStatus = usePrevious(txRefreshing);
  useEffect(() => {
    if (!txRefreshing && prevRefreshTxStatus) {
      setPage(1);
      setFilterInput('');
    }
  }, [txRefreshing, prevRefreshTxStatus]);

  const filterCol = useMemo(
    () => ({
      key: 'filter',
      width: 200,
      align: 'center',
      title: 'Type',
      render: (text: string, rowData: TxDetails) => {
        const { type } = rowData;

        return <TxLabel type={type} />;
      },
    }),
    [],
  );

  const handleSearchWithFilter = () => {
    if (!filterInput) {
      setFilter({
        ...filter,
        address: undefined,
        txId: undefined,
      });
    }
    if (isAddress(filterInput)) {
      setFilter({
        ...filter,
        address: filterInput,
      });
    } else {
      setFilter({
        ...filter,
        txId: filterInput,
      });
    }
  };

  const handleChangeFilterInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;

      setFilterInput(text);
    },
    [],
  );

  const renderFilter = () => {
    const type = filter?.type ?? 'all';

    return (
      <FilterContainer>
        <FilterDropdown value={type} onClick={handleSelectFilter} />
        <Form onFinish={handleSearchWithFilter} autoComplete="off">
          <Form.Item>
            <Input
              typevalue="ghost"
              sizevalue="big"
              value={filterInput}
              onChange={handleChangeFilterInput}
              autoComplete="off"
              placeholder="Searcy by Address / Tx ID"
            />
          </Form.Item>
        </Form>
      </FilterContainer>
    );
  };

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
        title: 'Type',
        render: (_: string, rowData: TxDetails) => {
          const { type, date: timestamp = 0, in: _in } = rowData;
          const date = new Date(timestamp * 1000);

          return (
            <div className="tx-history-row">
              <div className="tx-history-data">
                <TxLabel type={type} />
              </div>
              <div className="tx-history-info">
                <TxInfo data={rowData} />
              </div>
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
          );
        },
      },
    ],
    [],
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
        <Helmet title="Transactions" content="Transactions" />
        <ContentWrapper className="transaction-view-wrapper">
          <TxToolsContainer>
            <Button
              sizevalue="small"
              color="primary"
              typevalue="outline"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
            {!!walletAddress && (
              <Button
                sizevalue="small"
                color="primary"
                typevalue="outline"
                onClick={handleSearchMyAddress}
              >
                Search My Address
              </Button>
            )}
          </TxToolsContainer>
          {renderFilter()}
          {renderTxTable(data, loading)}
        </ContentWrapper>
        {count ? (
          <StyledPagination
            current={page}
            onChange={handleChangePage}
            pageSize={TX_PAGE_LIMIT}
            total={count}
            showSizeChanger={false}
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
          return pageContent([], 0, true);
        },
        () => pageContent([], 0, false),
        (data: InlineResponse2001): JSX.Element => {
          const { count = 0, txs = [] } = data;
          return pageContent(txs, count, false);
        },
      )(txData);
    } else {
      return (
        <ContentWrapper className="transaction-view-wrapper center-align">
          <Helmet title="Transactions" content="Transactions" />
          <AddWallet />
        </ContentWrapper>
      );
    }
  };

  return renderPage();
};

export default Transaction;
