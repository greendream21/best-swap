import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TradeCardWrapper } from './tradeCard.style';
import Coin from '../../uielements/coins/coin';
import Status from '../../uielements/status';
import Button from '../../uielements/button';

class TradeCard extends Component {
  static propTypes = {
    asset: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    depth: PropTypes.number,
    poolPrice: PropTypes.number,
    marketPrice: PropTypes.number,
    premium: PropTypes.number,
    reward: PropTypes.number,
    onBuy: PropTypes.func.isRequired,
    onSell: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    depth: 0,
    poolPrice: 0,
    marketPrice: 0,
    premium: 0,
    reward: 0,
    className: '',
  };

  render() {
    const {
      asset,
      target,
      depth,
      poolPrice,
      marketPrice,
      premium,
      reward,
      onBuy,
      onSell,
      className,
      ...props
    } = this.props;

    const poolValue = `${asset}:${target}`;
    const depthValue = `$${depth}`;
    const poolPriceValue = `$${poolPrice}`;
    const marketPriceValue = `$${marketPrice}`;
    const premiumValue = `${premium}%`;
    const rewardValue = `$${reward}`;

    return (
      <TradeCardWrapper className={`tradeCard-wrapper ${className}`} {...props}>
        <Coin
          className="coinData-coin-avatar"
          type={asset}
          over={target}
          size="big"
        />
        <Status className="pool-status" title="Pool" value={poolValue} />
        <Status title="Depth" value={depthValue} />
        <Status title="Pool Price" value={poolPriceValue} />
        <Status title="Market Price" value={marketPriceValue} />
        <Status title="Premium" value={premiumValue} />
        <Status
          className="reward-status"
          title="Potential Reward"
          value={rewardValue}
        />
        <div className="trade-actions-wrapper">
          <Button onClick={onBuy} color="success" typevalue="outline">
            buy
          </Button>
          <Button onClick={onSell} color="error" typevalue="outline">
            sell
          </Button>
        </div>
      </TradeCardWrapper>
    );
  }
}

export default TradeCard;
