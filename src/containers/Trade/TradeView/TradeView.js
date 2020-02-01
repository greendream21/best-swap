import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TradeCard from '../../../components/trade/tradeCard';
import TradeLoader from '../../../components/utility/loaders/trade';
import { ContentWrapper } from './TradeView.style';
import { getTradeData } from '../utils';
import { getFixedNumber } from '../../../helpers/stringHelper';

import * as midgardActions from '../../../redux/midgard/actions';
import binanceActions from '../../../redux/binance/actions';

const { getBinanceMarkets } = binanceActions;

class TradeView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getPools, getRunePrice, getBinanceMarkets } = this.props;

    getPools();
    getRunePrice();
    getBinanceMarkets();
  }

  handleTrade = asset => () => {
    const URL = `/trade/${asset}`;

    this.props.history.push(URL);
  };

  renderTradeList = () => {
    const {
      pools,
      poolData,
      runePrice,
      assetData,
      binanceData: { marketList },
    } = this.props;

    const bnbMarket = marketList.find(
      market => market.base_asset_symbol === 'BNB',
    );
    const bnbPrice = Number((bnbMarket && bnbMarket.list_price) || 0);

    return pools.map((pool, index) => {
      const { symbol } = pool;
      const poolInfo = poolData[symbol] || {};

      const binanceMarket = marketList.find(
        market => market.base_asset_symbol === symbol,
      );
      const marketPrice = Number(
        (binanceMarket && binanceMarket.list_price) || 0,
      );

      if (symbol.toLowerCase() === 'bnb') {
        const { depth, poolPrice, premium, reward } = getTradeData(
          'rune',
          symbol,
          pool,
          poolInfo,
          assetData,
          runePrice,
          bnbPrice,
          runePrice,
        );

        return (
          <TradeCard
            className="trade-card"
            asset="bnb"
            target="rune"
            depth={depth}
            poolPrice={poolPrice}
            marketPrice={getFixedNumber(runePrice, 6)}
            premium={premium}
            reward={reward}
            onTrade={this.handleTrade('RUNE-A1F')} // TODO: hardcoded rune symbol
            key={index}
          />
        );
      } else {
        const { target, depth, poolPrice, premium, reward } = getTradeData(
          'bnb',
          symbol,
          pool,
          poolInfo,
          assetData,
          runePrice,
          bnbPrice,
          marketPrice,
        );

        return (
          <TradeCard
            className="trade-card"
            asset="bnb"
            target={target}
            depth={depth}
            poolPrice={poolPrice}
            marketPrice={getFixedNumber(marketPrice, 6)}
            premium={premium}
            reward={reward}
            onTrade={this.handleTrade(symbol)}
            key={index}
          />
        );
      }
    });
  };

  render() {
    const {
      loading,
      binanceData: { loadingMarket },
    } = this.props;

    const isLoading = loading || loadingMarket;

    return (
      <ContentWrapper className="trade-view-wrapper">
        {isLoading && <TradeLoader />}
        {!isLoading && (
          <div className="trade-list-view">{this.renderTradeList()}</div>
        )}
      </ContentWrapper>
    );
  }
}

TradeView.propTypes = {
  history: PropTypes.object.isRequired,
  getPools: PropTypes.func.isRequired,
  pools: PropTypes.array.isRequired,
  poolData: PropTypes.object.isRequired,
  assetData: PropTypes.array.isRequired,
  getRunePrice: PropTypes.func.isRequired,
  getBinanceMarkets: PropTypes.func.isRequired,
  runePrice: PropTypes.number.isRequired,
  binanceData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default compose(
  connect(
    state => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      loading: state.Midgard.poolLoading,
      runePrice: state.Wallet.runePrice,
      assetData: state.Wallet.assetData,
      binanceData: state.Binance,
    }),
    {
      getPools: midgardActions.getPools,
      getRunePrice: midgardActions.getRunePrice,
      getBinanceMarkets,
    },
  ),
  withRouter,
)(TradeView);
