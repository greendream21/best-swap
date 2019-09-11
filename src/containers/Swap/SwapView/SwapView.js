import React, { Fragment, Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Label from '../../../components/uielements/label';
import CoinButton from '../../../components/uielements/coins/coinButton';
import SwapCard from '../../../components/swap/swapCard';

import { ContentWrapper } from './SwapView.style';

import statechainActions from '../../../redux/statechain/actions';

const { getPools } = statechainActions;

class SwapView extends Component {
  static propTypes = {
    getPools: PropTypes.func.isRequired,
    pools: PropTypes.array.isRequired,
  };

  state = {
    activeAsset: 'rune',
  };

  componentDidMount() {
    const { getPools } = this.props;

    getPools();
  }

  handleChooseBasePair = asset => () => {
    this.setState({
      activeAsset: asset,
    });
  };

  handleSwap = (source, target) => () => {
    const URL = `/swap/detail/${source}-${target}`;

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

  renderSwapList = () => {
    const { pools } = this.props;
    const { activeAsset } = this.state;

    return pools.map((pool, index) => {
      const assetData = {
        asset: 'rune',
        target: pool.ticker,
        depth: pool.poolData.depth,
        volume: pool.poolData.vol24hr,
        transaction: pool.swapData.aveTxTkn,
        swaps: pool.poolData.numSwaps,
        slip: pool.swapData.aveSlipTkn,
      };
      const { volume, transaction, slip, swaps } = assetData;
      const target = assetData.target.split('-')[0];
      const depth = assetData.depth.toFixed(2);

      if (target !== activeAsset) {
        return (
          <SwapCard
            className="swap-card"
            asset="rune"
            target={target}
            depth={depth}
            volume={volume}
            transaction={transaction}
            slip={slip}
            trade={swaps}
            onSwap={this.handleSwap(activeAsset, target)}
            key={index}
          />
        );
      }
      return <Fragment />;
    });
  };

  render() {
    return (
      <ContentWrapper className="swap-view-wrapper">
        <div className="view-title">
          <Label size="normal" weight="bold" color="normal">
            CHOOSE BASE PAIR
          </Label>
        </div>
        <div className="asset-button-group">{this.renderAssets()}</div>
        <div className="swap-list-view">{this.renderSwapList()}</div>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      pools: state.Statechain.pools,
    }),
    {
      getPools,
    },
  ),
  withRouter,
)(SwapView);
