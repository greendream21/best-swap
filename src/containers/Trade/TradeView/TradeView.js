import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TradeCard from '../../../components/trade/tradeCard';
import { ContentWrapper } from './TradeView.style';
import { getTradeData } from '../utils';

import statechainActions from '../../../redux/statechain/actions';
import walletactions from '../../../redux/wallet/actions';

const { getPools } = statechainActions;
const { getRunePrice } = walletactions;

class TradeView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    getPools: PropTypes.func.isRequired,
    pools: PropTypes.array.isRequired,
    poolData: PropTypes.object.isRequired,
    swapData: PropTypes.object.isRequired,
    assetData: PropTypes.array.isRequired,
    getRunePrice: PropTypes.func.isRequired,
    runePrice: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  state = {};

  componentDidMount() {
    const { getPools, getRunePrice } = this.props;

    getPools();
    getRunePrice();
  }

  handleTrade = asset => () => {
    const URL = `/trade/${asset}`;

    this.props.history.push(URL);
  };

  renderTradeList = () => {
    const { pools, poolData, swapData, runePrice, assetData } = this.props;

    return pools.map((pool, index) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};
      const swapInfo = swapData[symbol] || {};

      if (symbol.toLowerCase() === 'bnb') {
        const { depth, poolPrice } = getTradeData(
          'rune',
          symbol,
          pool,
          poolInfo,
          swapInfo,
          assetData,
          runePrice,
        );

        return (
          <TradeCard
            className="trade-card"
            asset="bnb"
            target="rune"
            depth={depth}
            poolPrice={poolPrice}
            marketPrice={1}
            premium={20}
            reward={230}
            onTrade={this.handleTrade(symbol)}
            key={index}
          />
        );
      } else {
        const { target, depth, poolPrice } = getTradeData(
          'rune',
          symbol,
          poolInfo,
          swapInfo,
          assetData,
          runePrice,
        );

        return (
          <TradeCard
            className="trade-card"
            asset="bnb"
            target={target}
            depth={depth}
            poolPrice={poolPrice}
            marketPrice={1}
            premium={20}
            reward={230}
            onTrade={this.handleTrade(symbol)}
            key={index}
          />
        );
      }
    });
  };

  render() {
    return (
      <ContentWrapper className="trade-view-wrapper">
        <div className="trade-list-view">{this.renderTradeList()}</div>
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
      loading: state.Statechain.loading,
      runePrice: state.Wallet.runePrice,
      assetData: state.Wallet.assetData,
    }),
    {
      getPools,
      getRunePrice,
    },
  ),
  withRouter,
)(TradeView);
