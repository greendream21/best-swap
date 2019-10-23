import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import Label from '../../../components/uielements/label';
import CoinButton from '../../../components/uielements/coins/coinButton';

import { ContentWrapper } from './SwapView.style';

import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';
import { getSwapData } from './data';
import SwapLoader from '../../../components/utility/loaders/swap';
import CoinPair from '../../../components/uielements/coins/coinPair';
import Trend from '../../../components/uielements/trend';
import Button from '../../../components/uielements/button';
import Table from '../../../components/uielements/table';

const { getPools } = statechainActions;
const { getRunePrice } = walletactions;

class SwapView extends Component {
  static propTypes = {
    getPools: PropTypes.func.isRequired,
    pools: PropTypes.array.isRequired,
    poolData: PropTypes.object.isRequired,
    swapData: PropTypes.object.isRequired,
    assetData: PropTypes.array.isRequired,
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

  handleSwap = (source, target) => () => {
    const URL = `/swap/detail/${source.toLowerCase()}-${target.toLowerCase()}`;

    this.props.history.push(URL);
  };

  renderAssets = () => {
    const { activeAsset } = this.state;
    const asset = 'rune';
    return (
      <CoinButton
        cointype={asset}
        onClick={this.handleChooseBasePair(asset)}
        focused={asset === activeAsset}
        disabled={asset !== 'rune'} // enable only rune for base pair
        key={0}
      />
    );
  };

  renderSwapTable = swapViewData => {
    const columns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }) => <CoinPair from={asset} to={target} />,
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: 'depth',
      },
      {
        key: 'vol',
        title: '24h vol',
        dataIndex: 'volume',
      },
      {
        key: 'transaction',
        title: 'avg. transaction',
        dataIndex: 'transaction',
      },
      {
        key: 'slip',
        title: 'avg. slip',
        dataIndex: 'slip',
        render: slip => <Trend value={slip} />,
      },
      {
        key: 'trade',
        title: 'no. of trades',
        dataIndex: 'trade',
      },
      {
        key: 'swap',
        title: (
          <Button typevalue="outline">
            <Icon type="sync" />
            refresh
          </Button>
        ),
        render: () => (
          <Button style={{ margin: 'auto' }} round>
            <Icon type="swap" />
            swap
          </Button>
        ),
      },
    ];

    return <Table columns={columns} dataSource={swapViewData} />;
  };

  renderSwapList = () => {
    const { pools, poolData, swapData, assetData, runePrice } = this.props;
    const { activeAsset } = this.state;

    const swapViewData = pools.reduce((result, pool) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};
      const swapInfo = swapData[symbol] || {};

      const swapCardData = getSwapData(
        'rune',
        symbol,
        poolInfo,
        swapInfo,
        assetData,
        runePrice,
      );

      if (swapCardData.target !== activeAsset) {
        result.push(swapCardData);
      }

      return result;
    }, []);

    return this.renderSwapTable(swapViewData);
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
            <div className="swap-list-view">{this.renderSwapList()}</div>
          </>
        )}
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      pools: state.Statechain.pools,
      poolData: state.Statechain.poolData,
      swapData: state.Statechain.swapData,
      runePrice: state.Wallet.runePrice,
      assetData: state.Wallet.assetData,
      loading: state.Statechain.loading,
    }),
    {
      getPools,
      getRunePrice,
    },
  ),
  withRouter,
)(SwapView);
