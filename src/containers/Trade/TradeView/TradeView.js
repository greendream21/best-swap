import React, { Fragment, Component } from 'react';
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

      const { target, depth } = getTradeData(
        'rune',
        symbol,
        poolInfo,
        swapInfo,
        assetData,
        runePrice,
      );

      if (target !== 'bnb') {
        return (
          <TradeCard
            className="trade-card"
            asset="bnb"
            target={target}
            depth={depth}
            poolPrice={1.2}
            marketPrice={1}
            premium={20}
            reward={230}
            onTrade={this.handleTrade(symbol)}
            key={index}
          />
        );
      }
      return <Fragment />;
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
