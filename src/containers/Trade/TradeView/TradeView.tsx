import React from 'react';
import * as H from 'history';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TradeCard from '../../../components/trade/tradeCard';
import TradeLoader from '../../../components/utility/loaders/trade';
import { ContentWrapper } from './TradeView.style';
import { getTradeData } from '../utils';
import { getFixedNumber } from '../../../helpers/stringHelper';

import * as midgardActions from '../../../redux/midgard/actions';
import * as binanceActions from '../../../redux/binance/actions';
import { State as BinanceState } from '../../../redux/binance/types';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { PoolDataMap, PriceDataIndex } from '../../../redux/midgard/types';
import { AssetData } from '../../../redux/wallet/types';
import { RootState } from '../../../redux/store';

type ComponentProps = {
  runePrice: number;
  loading: boolean;
};

type ConnectedProps = {
  history: H.History;
  pools: string[];
  poolData: PoolDataMap;
  assetData: AssetData[];
  getPools: typeof midgardActions.getPools;
  getRunePrice: typeof midgardActions.getRunePrice;
  getBinanceMarkets: typeof binanceActions.getBinanceMarkets;
  binanceData: BinanceState;
  priceIndex: PriceDataIndex;
};

type Props = ComponentProps & ConnectedProps;

type State = {}

class TradeView extends React.Component<Props, State> {
  componentDidMount() {
    const { getPools, getRunePrice, getBinanceMarkets } = this.props;

    getPools();
    getRunePrice();
    getBinanceMarkets();
  }

  handleTrade = (asset: string) => () => {
    const URL = `/trade/${asset}`;

    this.props.history.push(URL);
  };

  renderTradeList = () => {
    const {
      pools,
      poolData,
      assetData,
      priceIndex,
      binanceData: { marketList },
    } = this.props;

    const runePrice = priceIndex.RUNE;

    const bnbMarket = marketList.find(
      market => market.base_asset_symbol === 'BNB',
    );
    const bnbPrice = Number((bnbMarket && bnbMarket.list_price) || 0);

    return pools.map((pool, index) => {
      const { symbol = '' } = getAssetFromString(pool);
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

export default compose(
  connect(
    (state: RootState) => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      loading: state.Midgard.poolLoading,
      priceIndex: state.Midgard.priceIndex,
      assetData: state.Wallet.assetData,
      binanceData: state.Binance,
    }),
    {
      getPools: midgardActions.getPools,
      getRunePrice: midgardActions.getRunePrice,
      getBinanceMarkets: binanceActions.getBinanceMarkets,
    },
  ),
  withRouter,
)(TradeView) as React.ComponentClass<ComponentProps, State>;
