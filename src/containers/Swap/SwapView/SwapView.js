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

import * as midgardActions from '../../../redux/midgard/actions';
import { getSwapData } from './data';

class SwapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAsset: 'rune',
    };
  }

  componentDidMount() {
    const { getPools } = this.props;

    getPools();
  }

  handleChooseBasePair = asset => () => {
    this.setState({
      activeAsset: asset,
    });
  };

  renderAssets = () => {
    const { priceIndex, basePriceAsset } = this.props;
    const { activeAsset } = this.state;
    const asset = 'rune';
    const runePrice = priceIndex.RUNE;

    return (
      <CoinButton
        cointype={asset}
        onClick={this.handleChooseBasePair(asset)}
        focused={asset === activeAsset}
        disabled={asset !== 'rune'} // enable only rune for base pair
        price={runePrice}
        priceUnit={basePriceAsset}
        key={0}
      />
    );
  };

  renderSwapTable = (swapViewData, view) => {
    const { getPools } = this.props;

    const btnCol = {
      key: 'swap',
      title: (
        <Button
          onClick={() => {
            getPools();
          }}
          typevalue="outline"
        >
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
        defaultSortOrder: 'descend',
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
    return <Table columns={columns} dataSource={swapViewData} rowKey="key" />;
  };

  renderSwapList = view => {
    const { pools, poolData, priceIndex, basePriceAsset } = this.props;
    const { activeAsset } = this.state;

    let key = 0;
    const swapViewData = pools.reduce((result, pool) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};

      const swapCardData = getSwapData(
        'rune',
        poolInfo,
        priceIndex,
        basePriceAsset,
      );

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

SwapView.propTypes = {
  getPools: PropTypes.func.isRequired,
  pools: PropTypes.array.isRequired,
  poolData: PropTypes.object.isRequired,
  basePriceAsset: PropTypes.string.isRequired,
  priceIndex: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object,
};

export default compose(
  connect(
    state => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      loading: state.Midgard.poolLoading,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(SwapView);
