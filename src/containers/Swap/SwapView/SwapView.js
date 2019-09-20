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
import walletactions from '../../../redux/wallet/actions';
import { getSwapData } from './data';

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
    runePrice: PropTypes.number.isRequired,
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

  renderSwapList = () => {
    const { pools, poolData, swapData, assetData, runePrice } = this.props;
    const { activeAsset } = this.state;

    return pools.map((pool, index) => {
      const { ticker } = pool;
      const poolInfo = poolData[ticker] || {};
      const swapInfo = swapData[ticker] || {};

      const swapCardData = getSwapData(
        'rune',
        ticker,
        poolInfo,
        swapInfo,
        assetData,
        runePrice,
      );

      if (swapCardData.target !== activeAsset) {
        return (
          <SwapCard
            className="swap-card"
            asset="rune"
            onSwap={this.handleSwap(activeAsset, swapCardData.target)}
            {...swapCardData}
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
      poolData: state.Statechain.poolData,
      swapData: state.Statechain.swapData,
      runePrice: state.Wallet.runePrice,
      assetData: state.Wallet.assetData,
    }),
    {
      getPools,
      getRunePrice,
    },
  ),
  withRouter,
)(SwapView);
