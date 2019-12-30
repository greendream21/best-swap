import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import Label from '../../../components/uielements/label';
import CoinButton from '../../../components/uielements/coins/coinButton';

import { ContentWrapper } from './SwapView.style';

import SwapLoader from '../../../components/utility/loaders/swap';
import CoinPair from '../../../components/uielements/coins/coinPair';
import Trend from '../../../components/uielements/trend';
import Button from '../../../components/uielements/button';
import Table from '../../../components/uielements/table';

import midgardActions from '../../../redux/midgard/actions';
import { getSwapData } from './data';

const { getPools, getRunePrice } = midgardActions;

class SwapView extends Component {
  static propTypes = {
    getPools: PropTypes.func.isRequired,
    pools: PropTypes.array.isRequired,
    poolData: PropTypes.object.isRequired,
    getRunePrice: PropTypes.func.isRequired,
    runePrice: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    history: PropTypes.object,
  };

  state = {
    activeAsset: 'rune',
  };

  componentDidMount() {
    const { getPools, getRunePrice } = this.props;

    getPools();
    getRunePrice();
  }

  handleChooseBasePair = asset => () => {
    this.setState({
      activeAsset: asset,
    });
  };

  renderAssets = () => {
    const { runePrice } = this.props;
    const { activeAsset } = this.state;
    const asset = 'rune';

    return (
      <CoinButton
        cointype={asset}
        onClick={this.handleChooseBasePair(asset)}
        focused={asset === activeAsset}
        disabled={asset !== 'rune'} // enable only rune for base pair
        price={runePrice}
        key={0}
      />
    );
  };

  renderSwapTable = (swapViewData, view) => {
    const btnCol = {
      key: 'swap',
      title: (
        <Button typevalue="outline">
          <Icon type="sync" />
          refresh
        </Button>
      ),
      render: (text, record) => {
        const {
          pool: { asset, target },
        } = record;
        const URL = `/swap/detail/${asset.toLowerCase()}-${target.toLowerCase()}`;
        const dataTest = `swap-button-${target.toLowerCase()}`;

        return (
          <Link to={URL}>
            <Button
              style={{ margin: 'auto' }}
              round="true"
              data-test={dataTest}
            >
              <Icon type="swap" />
              swap
            </Button>
          </Link>
        );
      },
    };

    const mobileColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }) => <CoinPair from={asset} to={target} />,
      },
      btnCol,
    ];

    const desktopColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }) => <CoinPair from={asset} to={target} />,
      },
      {
        key: 'asset',
        title: 'asset',
        dataIndex: 'pool',
        render: ({ target }) => <p>{target}</p>,
        sorter: (a, b) => a.pool.target.localeCompare(b.pool.target),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: 'depth',
        sorter: (a, b) => a.raw.depth - b.raw.depth,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'vol',
        title: '24h vol',
        dataIndex: 'volume',
        sorter: (a, b) => a.raw.volume - b.raw.volume,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'transaction',
        title: 'avg. transaction',
        dataIndex: 'transaction',
        sorter: (a, b) => a.raw.transaction - b.raw.transaction,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'slip',
        title: 'avg. slip',
        dataIndex: 'slip',
        render: slip => <Trend value={slip} />,
        sorter: (a, b) => a.raw.slip - b.raw.slip,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'trade',
        title: 'no. of trades',
        dataIndex: 'trade',
        sorter: (a, b) => a.raw.trade - b.raw.trade,
        sortDirections: ['descend', 'ascend'],
      },
      btnCol,
    ];

    const columnData = {
      desktop: desktopColumns,
      mobile: mobileColumns,
    };
    const columns = columnData[view] || desktopColumns;
    console.log('swapViewData: ', swapViewData);
    return <Table columns={columns} dataSource={swapViewData} rowKey="key" />;
  };

  renderSwapList = view => {
    const { pools, poolData, runePrice } = this.props;
    const { activeAsset } = this.state;

    let key = 0;
    const swapViewData = pools.reduce((result, pool) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};

      const swapCardData = getSwapData('rune', poolInfo, runePrice);

      if (swapCardData.target !== activeAsset) {
        result.push({ ...swapCardData, key });
        key += 1;
      }

      return result;
    }, []);

    return this.renderSwapTable(swapViewData, view);
  };

  render() {
    const { loading } = this.props;

    return (
      <ContentWrapper className="swap-view-wrapper">
        {loading && <SwapLoader />}
        {!loading && (
          <>
            <div className="view-title">
              <Label size="normal" weight="bold" color="normal">
                CHOOSE BASE PAIR
              </Label>
            </div>
            <div className="asset-button-group">{this.renderAssets()}</div>
            <div className="swap-list-view desktop-view">
              {this.renderSwapList('desktop')}
            </div>
            <div className="swap-list-view mobile-view">
              {this.renderSwapList('mobile')}
            </div>
          </>
        )}
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      runePrice: state.Midgard.runePrice,
      loading: state.Midgard.poolLoading,
    }),
    {
      getPools,
      getRunePrice,
    },
  ),
  withRouter,
)(SwapView);
